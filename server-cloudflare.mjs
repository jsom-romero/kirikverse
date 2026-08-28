import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";



import homeTemplate from "./templates/home.js";
import adminTemplate from "./templates/admin.js";
import loginTemplate from "./templates/login.js";
import registerTemplate from "./templates/register.js";
import calendarioTemplate from "./templates/calendar.js";


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

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
}


async function requireAdmin(req, res, next) {

    if (!req.session.userId) {
        return res.status(401).json({
            error: "Debes iniciar sesión."
        });
    }

    const user = await env.DB.prepare(`
        SELECT is_admin
        FROM users
        WHERE id = ?
    `)
        .bind(req.session.userId)
        .first();

    if (!user || user.is_admin !== 1) {
        return res.status(403).json({
            error: "Solo los administradores pueden hacer esto."
        });
    }

    next();
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

app.get("/", async (req, res) => {

    try {

        const result = await env.DB.prepare(`
            SELECT *
            FROM events
            ORDER BY date ASC, time ASC
        `).all();

        const events = result.results || [];

        const html = homeTemplate
            .replace("{{EVENTOS}}", renderEvents(events));

        res
            .status(200)
            .setHeader("Content-Type", "text/html; charset=utf-8")
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

app.get("/admin", requireLogin, async (req, res) => {

    try {

        const result = await env.DB.prepare(`
            SELECT id, username
            FROM users
            ORDER BY username ASC
        `).all();

        const users = result.results || [];

        return res.status(200).send(
            adminTemplate(
                users,
                req.session.userId
            )
        );

    } catch (error) {

        console.error("ERROR ADMIN:", error);

        return res
            .status(500)
            .send("Error al cargar el panel");
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

        return res.redirect("/admin");

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

app.get("/register", async (req, res) => {
    try {
        res.status(200).send(registerTemplate());
    } catch (error) {
        console.error("ERROR REGISTER:", error);

        res.status(500).send(
            "Error al cargar el registro: " +
            String(error?.message || error)
        );
    }
});

app.post("/register", async (req, res) => {

    console.log("========== REGISTER ==========");

    try {

        const { username, password } = req.body;

        console.log("USERNAME:", username);

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

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        await env.DB
            .prepare(`
                INSERT INTO users
                (
                    username,
                    password
                )
                VALUES (?, ?)
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
// ADMIN
// ============================================================

app.get("/calendar", async (req, res) => {
    try {
        return res.status(200).send(
            calendarioTemplate()
        );
    } catch (error) {
        console.error("ERROR CALENDARIO:", error);

        return res.status(500).send(
            "Error al cargar el calendario: " +
            String(error?.message || error)
        );
    }
});

// ============================================================
// CALENDAR
// ============================================================

app.get("/calendario", async (req, res) => {
    try {
        res.status(200).send(calendarioTemplate());
    } catch (error) {
        console.error("ERROR CALENDARIO:", error);
        res.status(500).send(
            "Error al cargar el calendario: " + error.message
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

app.delete("/api/users/:id", requireLogin, async (req, res) => {

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

app.post("/api/events",requireAdmin, async (req, res) => {

    const {
        title,
        description,
        date,
        time,
        category
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
                user_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `)
            .bind(
                title,
                description || "",
                date,
                time || "",
                category || "general",
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

app.put("/api/events/:id", async (req, res) => {

    const eventId = req.params.id;

    const {
        title,
        description,
        date,
        time,
        category
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
                category = ?
            WHERE id = ?
        `)
            .bind(
                title,
                description || "",
                date,
                time || "",
                category || "general",
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