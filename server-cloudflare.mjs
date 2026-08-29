import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";




import homeTemplate from "./public/templates/home.js";
import loginTemplate from "./public/templates/login.js";
import registerTemplate from "./public/templates/register.js";
import calendarioTemplate from "./public/templates/calendar.js";


const app = express();

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

// ============================================================
// CONFIG
// ============================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// TEMPLATES
// Compatible con Cloudflare Workers
// ============================================================

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderAdminUsers(users = [], sessionUserId = null) {

    if (users.length === 0) {

        return `
            <p class="vacio">
                No hay usuarios registrados.
            </p>
        `;
    }

    return `
        <ul class="usuarios">

            ${users.map(user => `

                <li class="usuario">

                    <span class="usuario__nombre">
                        ${escapeHtml(user.username)}
                    </span>

                    ${
                        user.id === sessionUserId
                            ? `
                                <span class="usuario__yo">
                                    Tú
                                </span>
                            `
                            : ""
                    }

                </li>

            `).join("")}

        </ul>
    `;
}

function renderEvents(events) {

    if (!events || events.length === 0) {
        return `<p class="vacio">No hay eventos todavía.</p>`;
    }

    return `
        <div class="eventos">

            ${events.map(event => `
                <article class="evento">

                    <h3>${escapeHtml(event.title)}</h3>

                    ${
                        event.description
                            ? `<p>${escapeHtml(event.description)}</p>`
                            : ""
                    }

                    <p class="evento__fecha">
                        📅 ${escapeHtml(event.date)}
                        ${
                            event.time
                                ? ` — ${escapeHtml(event.time)}`
                                : ""
                        }
                    </p>

                    ${
                        event.category
                            ? `
                                <p class="evento__categoria">
                                    ${escapeHtml(event.category)}
                                </p>
                            `
                            : ""
                    }

                </article>
            `).join("")}

        </div>
    `;
}


// ------------------------------------------------------------
// HOME
// ------------------------------------------------------------

function renderHome(template, events) {

    let eventosHtml = "";

    if (!events || events.length === 0) {

        eventosHtml = `
            <p class="vacio">
                No hay eventos todavía.
            </p>
        `;

    } else {

        eventosHtml = `
            <div class="eventos">

                ${events.map(event => `

                    <article class="evento">

                        <h3>
                            ${escapeHtml(event.title)}
                        </h3>

                        ${
                            event.description
                                ? `
                                    <p>
                                        ${escapeHtml(event.description)}
                                    </p>
                                  `
                                : ""
                        }

                        <p class="evento__fecha">
                            📅 ${escapeHtml(event.date)}

                            ${
                                event.time
                                    ? ` — ${escapeHtml(event.time)}`
                                    : ""
                            }
                        </p>

                        ${
                            event.category
                                ? `
                                    <p class="evento__categoria">
                                        ${escapeHtml(event.category)}
                                    </p>
                                  `
                                : ""
                        }

                    </article>

                `).join("")}

            </div>
        `;
    }

    return template.replace(
        "<!-- EVENTOS_AQUI -->",
        eventosHtml
    );
}


// ============================================================
// SESIONES
// ============================================================

async function getSession(req) {

    const cookie = req.headers.cookie || "";

    const match = cookie
        .split(";")
        .map(value => value.trim())
        .find(value => value.startsWith("sessionId="));

    if (!match) {
        return null;
    }

    const sessionId = decodeURIComponent(
        match.substring("sessionId=".length)
    );

    const now = Date.now();

    const result = await env.DB.prepare(`
        SELECT
            sessions.id,
            sessions.user_id,
            sessions.expires_at,
            users.username
        FROM sessions
        INNER JOIN users
            ON users.id = sessions.user_id
        WHERE sessions.id = ?
          AND sessions.expires_at > ?
    `)
        .bind(sessionId, now)
        .all();

    if (!result.results || result.results.length === 0) {
        return null;
    }

    const session = result.results[0];

    return {
        id: session.id,
        userId: session.user_id,
        username: session.username,
        expiresAt: session.expires_at
    };
}


app.use(async (req, res, next) => {

    try {

        const session = await getSession(req);

        req.session = session
            ? {
                id: session.id,
                userId: session.userId,
                username: session.username
            }
            : {};

        next();

    } catch (error) {

        console.error("Error comprobando sesión:", error);

        req.session = {};

        next();
    }
});


function requireLogin(req, res, next) {
    if (!req.session?.userId) {
        return res.redirect("/register");
    }

    next();
}

async function requireAdmin(req, res, next) {
    if (!req.session?.userId) {
        return res.redirect("/");
    }

    try {
        const user = await env.DB
            .prepare(`
                SELECT is_admin
                FROM users
                WHERE id = ?
            `)
            .bind(req.session.userId)
            .first();

        if (!user || Number(user.is_admin) !== 1) {
            return res.redirect("/");
        }

        next();

    } catch (error) {
        console.error("ERROR COMPROBANDO ADMIN:", error);
        return res.redirect("/");
    }
}


async function createSession(userId, username, res) {

    const sessionId = crypto.randomUUID();

    const expiresAt =
        Date.now() + SESSION_DURATION;

    await env.DB.prepare(`
        INSERT INTO sessions
        (id, user_id, expires_at)
        VALUES (?, ?, ?)
    `)
        .bind(
            sessionId,
            userId,
            expiresAt
        )
        .run();

    res.setHeader(
        "Set-Cookie",
        [
            `sessionId=${encodeURIComponent(sessionId)}`,
            "Path=/",
            "HttpOnly",
            "Secure",
            "SameSite=Lax",
            `Max-Age=${Math.floor(SESSION_DURATION / 1000)}`
        ].join("; ")
    );
}


async function destroySession(req, res) {

    const cookie = req.headers.cookie || "";

    const match = cookie
        .split(";")
        .map(value => value.trim())
        .find(value => value.startsWith("sessionId="));

    if (match) {

        const sessionId = decodeURIComponent(
            match.substring("sessionId=".length)
        );

        await env.DB.prepare(`
            DELETE FROM sessions
            WHERE id = ?
        `)
            .bind(sessionId)
            .run();
    }

    res.setHeader(
        "Set-Cookie",
        "sessionId=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    );
}


// ============================================================
// HOME
// ============================================================

app.get("/", requireLogin, async (req, res) => {
    try {

        const result = await env.DB.prepare(`
            SELECT *
            FROM events
            ORDER BY date ASC, time ASC
        `).all();

        const events = result.results || [];

        let adminButton = "";

        if (req.session?.userId) {

            const user = await env.DB.prepare(`
                SELECT is_admin
                FROM users
                WHERE id = ?
            `)
                .bind(req.session.userId)
                .first();

            if (user?.is_admin === 1) {

                adminButton = `
                    <a
                        class="btn"
                        href="/admin-panel"
                    >
                        Admin
                    </a>
                `;
            }
        }

        const html = homeTemplate
            .replace("{{EVENTOS}}", renderEvents(events))
            .replace("{{ADMIN_BUTTON}}", adminButton);

        res
            .status(200)
            .setHeader(
                "Content-Type",
                "text/html; charset=utf-8"
            )
            .send(html);

    } catch (error) {

        console.error("Error cargando home:", error);

        res
            .status(500)
            .send("Error al cargar los eventos.");
    }
});


// ============================================================
// ADMIN
// ============================================================
app.get("/admin-panel", requireAdmin, async (req, res) => {

    try {

        // Obtener usuarios desde D1
        const result = await env.DB.prepare(`
            SELECT
                id,
                username
            FROM users
            WHERE is_admin = 1
            ORDER BY username ASC
        `).all();

        const users = result.results || [];


        // Cargar admin.html desde Cloudflare Assets
        const assetResponse = await env.ASSETS.fetch(
            new Request("https://assets.local/admin-assets/admin.html")
        );


        if (!assetResponse.ok) {

            console.error(
                "ERROR: No se pudo cargar admin.html"
            );

            return res
                .status(500)
                .send(
                    "No se pudo cargar el panel de administración."
                );
        }


        // Convertir HTML a texto
        let html = await assetResponse.text();


        // Generar la lista de usuarios
        const usersHtml = renderAdminUsers(
            users,
            req.session.userId
        );

        html = html.replace(
            "{{USERS_HTML}}",
            usersHtml
        );

        // Enviar HTML final
        return res
            .status(200)
            .set(
                "Content-Type",
                "text/html; charset=utf-8"
            )
            .send(html);


    } catch (error) {

        console.error(
            "ERROR ADMIN:",
            error
        );

        return res
            .status(500)
            .send(
                "Error al cargar el panel de administración."
            );
    }
});

// ============================================================
// LOGIN
// ============================================================

app.get("/login", (req, res) => {
    res.status(200).send(loginTemplate());
});

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send(
                "El usuario y la contraseña son obligatorios."
            );
        }

        const user = await env.DB
            .prepare(`
                SELECT
                    id,
                    username,
                    password,
                    is_admin
                FROM users
                WHERE username = ?
            `)
            .bind(username)
            .first();

        if (!user) {
            return res.status(401).send(
                "Usuario o contraseña incorrectos."
            );
        }

        const passwordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordCorrect) {
            return res.status(401).send(
                "Usuario o contraseña incorrectos."
            );
        }

        // Crear sesión
        await createSession(
            user.id,
            user.username,
            res
        );

        console.log(
            "LOGIN CORRECTO:",
            user.username
        );

        if (Number(user.is_admin) === 1) {
            return res.redirect("/admin-panel");
        }

        return res.redirect("/");

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).send(
            "Error interno del servidor."
        );
    }
});


// ============================================================
// REGISTRO
// ============================================================
app.get("/register", (req, res) => {

    try {

        const html = registerTemplate();

        return res
            .status(200)
            .set(
                "Content-Type",
                "text/html; charset=utf-8"
            )
            .send(html);

    } catch (error) {

        console.error(
            "ERROR REGISTER:",
            error
        );

        return res
            .status(500)
            .send(
                "Error al cargar la página de registro."
            );
    }
});


app.post("/register", async (req, res) => {

    console.log("========== REGISTER ==========");

    try {

        const { username, password } = req.body;

        console.log("USERNAME:", username);

        // --------------------------------------------------------
        // COMPROBAR DATOS
        // --------------------------------------------------------

        if (!username || !password) {

            return res.status(400).send(
                "El nombre de usuario y la contraseña son obligatorios."
            );
        }

        if (password.length < 6) {

            return res.status(400).send(
                "La contraseña debe tener al menos 6 caracteres."
            );
        }

        // --------------------------------------------------------
        // COMPROBAR USUARIO
        // --------------------------------------------------------

        const existingUser = await env.DB
            .prepare(`
                SELECT id
                FROM users
                WHERE username = ?
            `)
            .bind(username)
            .first();

        if (existingUser) {

            return res.status(400).send(
                "Ese nombre de usuario ya está registrado."
            );
        }

        // --------------------------------------------------------
        // HASHEAR CONTRASEÑA
        // --------------------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        // --------------------------------------------------------
        // CREAR USUARIO
        // --------------------------------------------------------
        // IMPORTANTE:
        // is_admin SIEMPRE se establece en 0.
        // Nunca utilizamos un valor enviado por el cliente.
        // --------------------------------------------------------

        await env.DB
            .prepare(`
                INSERT INTO users
                (
                    username,
                    password,
                    is_admin
                )
                VALUES (?, ?, 0)
            `)
            .bind(
                username,
                hashedPassword
            )
            .run();

        console.log(
            "Usuario registrado correctamente:",
            username
        );

        return res.redirect("/login");

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).send(
            "Error al registrar el usuario: " +
            String(error?.message || error)
        );
    }
});

// ============================================================
// CALENDAR
// ============================================================

app.get("/calendar", requireLogin, async (req, res) => {
    try {

        let adminButton = "";

        if (req.session?.userId) {

            const user = await env.DB.prepare(`
                SELECT is_admin
                FROM users
                WHERE id = ?
            `)
                .bind(req.session.userId)
                .first();

            if (user?.is_admin === 1) {

                adminButton = `
                    <a
                        class="btn"
                        href="/admin-panel"
                    >
                        Admin
                    </a>
                `;
            }
        }

        return res
            .status(200)
            .send(
                calendarioTemplate()
                    .replace(
                        "{{ADMIN_BUTTON}}",
                        adminButton
                    )
            );

    } catch (error) {

        console.error(
            "ERROR CALENDARIO:",
            error
        );

        return res
            .status(500)
            .send(
                "Error al cargar el calendario: " +
                String(error?.message || error)
            );
    }
});

// ============================================================
// USUARIOS — CAMBIAR CONTRASEÑA
// ============================================================

app.put(
    "/api/users/:id/password",
    requireLogin,
    async (req, res) => {

        const userId = req.params.id;
        const { password } = req.body;

        if (!password) {

            return res.status(400).json({
                error: "La contraseña es obligatoria."
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                error:
                    "La contraseña debe tener al menos 6 caracteres."
            });
        }

        try {

            const hashedPassword =
                await bcrypt.hash(password, 12);

            const result = await env.DB.prepare(`
                UPDATE users
                SET password = ?
                WHERE id = ?
            `)
                .bind(
                    hashedPassword,
                    userId
                )
                .run();

            if (result.meta.changes === 0) {

                return res.status(404).json({
                    error: "Usuario no encontrado."
                });
            }

            res.json({
                message:
                    "Contraseña cambiada correctamente."
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "No se pudo cambiar la contraseña."
            });
        }
    }
);


// ============================================================
// USUARIOS — ELIMINAR CUENTA
// ============================================================

app.delete("/api/users/:id", requireAdmin, async (req, res) => {

    try {

        const userId = Number(req.params.id);

        if (!userId) {
            return res.status(400).json({
                error: "ID de usuario inválido"
            });
        }

        await env.DB.prepare(
            "DELETE FROM users WHERE id = ?"
        )
        .bind(userId)
        .run();

        return res.json({
            ok: true
        });

    } catch (error) {

        console.error("ERROR DELETE USER:", error);

        return res.status(500).json({
            error: "No se pudo eliminar el usuario"
        });
    }
});



// ============================================================
// EVENTOS — LISTAR
// ============================================================

app.get("/api/events", async (req, res) => {

    try {

        const result = await env.DB.prepare(`
            SELECT *
            FROM events
            ORDER BY date ASC, time ASC
        `).all();

        res.json(result.results || []);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudieron cargar los eventos."
        });
    }
});


// ============================================================
// EVENTOS — CREAR
// ============================================================
app.post("/api/events", requireAdmin, async (req, res) => {

    const {
        title,
        description,
        date,
        time,
        category,
        color
    } = req.body;

    if (!title || !date) {

        return res.status(400).json({
            error: "Title and date are required"
        });
    }

    try {

        const result = await env.DB.prepare(`
            INSERT INTO events
            (
                title,
                description,
                date,
                time,
                category,
                color,
                user_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
            .bind(
                title,
                description || "",
                date,
                time || "",
                category || "general",
                color || "#6366f1",
                req.session.userId || null
            )
            .run();

        res.json({
            message: "Event created",
            id: result.meta.last_row_id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudo crear el evento."
        });
    }
});


// ============================================================
// EVENTOS — EDITAR
// ============================================================
app.put("/api/events/:id", requireAdmin, async (req, res) => {

    const eventId = req.params.id;

    const {
        title,
        description,
        date,
        time,
        category,
        color
    } = req.body;

    if (!title || !date) {

        return res.status(400).json({
            error: "Title and date are required"
        });
    }

    try {

        const result = await env.DB.prepare(`
            UPDATE events
            SET
                title = ?,
                description = ?,
                date = ?,
                time = ?,
                category = ?,
                color = ?
            WHERE id = ?
        `)
            .bind(
                title,
                description || "",
                date,
                time || "",
                category || "general",
                color || "#6366f1",
                eventId
            )
            .run();

        if (result.meta.changes === 0) {

            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.json({
            message: "Event updated"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudo actualizar el evento."
        });
    }
});


// ============================================================
// EVENTOS — BORRAR
// ============================================================

app.delete("/api/events/:id", async (req, res) => {

    const eventId = req.params.id;

    try {

        const result = await env.DB.prepare(`
            DELETE FROM events
            WHERE id = ?
        `)
            .bind(eventId)
            .run();

        if (result.meta.changes === 0) {

            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.json({
            message: "Event deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudo eliminar el evento."
        });
    }
});


// ============================================================
// CLOUDFLARE WORKER
// ============================================================
app.listen(3000);

export default httpServerHandler({
    port: 3000
});