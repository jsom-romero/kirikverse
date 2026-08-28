import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";

import homeTemplate from "./templates/home.js";
import adminTemplate from "./templates/admin.js";
import loginTemplate from "./templates/login.js";
import registerTemplate from "./templates/register.js";

const app = express();

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

// ============================================================
// CONFIG
// ============================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ============================================================
// EJS
// ============================================================

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

        const usuarioActual = escapeHtml(
            req.session.username
        );

        const listaUsuarios = users.map(user => `
            <article class="usuario">
                <div class="usuario-info">
                    <strong>${escapeHtml(user.username)}</strong>
                    <span>ID ${escapeHtml(user.id)}</span>
                </div>
            </article>
        `).join("");

        res.status(200).send(`
<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1"
>

<title>Kirkversario · Admin</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
>

<style>

:root {

    --fondo: #F3EDDF;
    --texto: #191552;
    --tarjeta: #FBF7EC;

    --rosa: #FF4A6E;
    --amarillo: #FFC233;

    --borde: rgba(25,21,82,.20);
    --tenue: rgba(25,21,82,.55);

    --display:
        'Bricolage Grotesque',
        'Arial Black',
        sans-serif;

    --cuerpo:
        'Instrument Sans',
        system-ui,
        sans-serif;

    --mono:
        'DM Mono',
        monospace;
}


[data-tema="noche"] {

    --fondo: #12103F;
    --texto: #F3EDDF;
    --tarjeta: #1B1857;

    --borde: rgba(243,237,223,.20);
    --tenue: rgba(243,237,223,.58);
}


* {
    box-sizing: border-box;
}


body {

    margin: 0;

    background: var(--fondo);
    color: var(--texto);

    font-family: var(--cuerpo);

    line-height: 1.5;

    -webkit-font-smoothing: antialiased;
}


.env {

    max-width: 900px;

    margin: 0 auto;

    padding: 0 18px;
}


/* =========================
   CABECERA
========================= */

.top {

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 16px 18px;

    max-width: 900px;

    margin: 0 auto;

    border-bottom: 2px solid var(--texto);
}


.top h1 {

    margin: 0 auto 0 0;

    font-family: var(--display);

    font-weight: 800;

    font-size: 17px;

    text-transform: uppercase;

    letter-spacing: -.02em;
}


.top h1 span {

    color: var(--rosa);
}


.btn {

    font-family: var(--mono);

    font-size: 11px;

    text-transform: uppercase;

    letter-spacing: .07em;

    background: transparent;

    color: var(--texto);

    border: 1.5px solid var(--texto);

    border-radius: 999px;

    padding: 8px 14px;

    cursor: pointer;
}


.btn:hover {

    background: var(--texto);

    color: var(--fondo);
}


/* =========================
   HERO
========================= */

.hero {

    padding: 48px 0 36px;
}


.hero h2 {

    margin: 0 0 10px;

    font-family: var(--display);

    font-weight: 800;

    font-size: clamp(32px, 6vw, 50px);

    line-height: 1;

    letter-spacing: -.04em;
}


.hero p {

    margin: 0;

    color: var(--tenue);
}


.usuario-actual {

    display: inline-block;

    margin-top: 18px;

    padding: 7px 12px;

    background: var(--tarjeta);

    border: 1.5px solid var(--borde);

    border-radius: 999px;

    font-family: var(--mono);

    font-size: 12px;
}


/* =========================
   SECCIONES
========================= */

section {

    padding: 36px 0;
}


section + section {

    border-top: 2px solid var(--texto);
}


h3 {

    margin: 0 0 6px;

    font-family: var(--display);

    font-size: 30px;

    font-weight: 800;

    letter-spacing: -.03em;
}


.sub {

    margin: 0 0 22px;

    color: var(--tenue);

    font-size: 15px;
}


/* =========================
   USUARIOS
========================= */

.usuarios {

    display: grid;

    gap: 12px;
}


.usuario {

    background: var(--tarjeta);

    border: 2px solid var(--texto);

    border-radius: 14px;

    padding: 18px;
}


.usuario-info {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 15px;
}


.usuario-info strong {

    font-family: var(--display);

    font-size: 21px;

    font-weight: 800;
}


.usuario-info span {

    font-family: var(--mono);

    font-size: 10px;

    color: var(--tenue);

    border: 1px solid var(--borde);

    border-radius: 999px;

    padding: 5px 8px;
}


/* =========================
   PIE
========================= */

.pie {

    border-top: 2px solid var(--texto);

    padding: 22px 0 36px;

    font-family: var(--mono);

    font-size: 11px;

    color: var(--tenue);

    text-transform: uppercase;

    letter-spacing: .07em;
}


@media (max-width: 600px) {

    .hero {

        padding: 36px 0 28px;
    }


    .usuario-info {

        align-items: flex-start;

        flex-direction: column;
    }

}

</style>

</head>


<body>


<header class="top">

    <h1>
        Kirkversario
        <span>Admin</span>
    </h1>

    <button
        class="btn"
        id="btnTema"
        type="button"
    >
        Noche
    </button>

</header>


<main class="env">


    <div class="hero">

        <h2>
            Panel de administración
        </h2>

        <p>
            Gestiona los usuarios de Kirkversario.
        </p>

        <div class="usuario-actual">

            Sesión iniciada como:

            <strong>
                ${usuarioActual}
            </strong>

        </div>

    </div>


    <section>

        <h3>
            Usuarios
        </h3>

        <p class="sub">
            Usuarios registrados actualmente.
        </p>


        ${
            users.length === 0

            ? `
                <p class="sub">
                    No hay usuarios registrados.
                </p>
            `

            : `
                <div class="usuarios">

                    ${listaUsuarios}

                </div>
            `
        }

    </section>


    <div class="pie">

        Kirkversario · Panel de administración

    </div>


</main>


<script>

(function () {

    "use strict";


    var botonTema =
        document.getElementById("btnTema");


    botonTema.addEventListener(
        "click",
        function () {

            var noche =
                document.documentElement
                    .getAttribute("data-tema")
                    === "noche";


            document.documentElement
                .setAttribute(
                    "data-tema",
                    noche ? "papel" : "noche"
                );


            this.textContent =
                noche ? "Noche" : "Papel";

        }
    );

})();

</script>


</body>

</html>
        `);

    } catch (error) {

        console.error(
            "ERROR ADMIN:",
            error
        );

        res.status(500).send(
            "Error al cargar el panel: " +
            error.message
        );
    }
});


// ============================================================
// BORRAR MI CUENTA
// ============================================================

app.delete("/api/users/me", requireLogin, async (req, res) => {

    const userId = req.session.userId;

    try {

        const result = await env.DB.prepare(`
            DELETE FROM users
            WHERE id = ?
        `)
            .bind(userId)
            .run();

        if (result.meta.changes === 0) {

            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        await env.DB.prepare(`
            DELETE FROM sessions
            WHERE user_id = ?
        `)
            .bind(userId)
            .run();

        await destroySession(req, res);

        res.json({
            message: "Cuenta eliminada correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudo eliminar la cuenta."
        });
    }
});


// ============================================================
// REGISTRO
// ============================================================

app.get("/register", (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Registro</title>
        </head>
        <body>
            <h1>Registro</h1>

            <form method="POST" action="/register">
                <input
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    required
                >

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                >

                <button type="submit">
                    Registrarse
                </button>
            </form>

            <p>
                <a href="/login">Ir al login</a>
            </p>
        </body>
        </html>
    `);
});


app.post("/register", async (req, res) => {

    console.log("========== REGISTER TEST ==========");

    try {

        console.log("BODY:", req.body);

        return res.status(200).send(`
            <h1>REGISTER FUNCIONA</h1>
            <pre>${JSON.stringify(req.body, null, 2)}</pre>
        `);

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).send(
            "REGISTER ERROR: " +
            String(error?.message || error)
        );
    }
});


// ============================================================
// LOGIN
// ============================================================

app.get("/login", (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>

            <form method="POST" action="/login">
                <input
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    required
                >

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                >

                <button type="submit">
                    Entrar
                </button>
            </form>

            <p>
                <a href="/register">Crear cuenta</a>
            </p>
        </body>
        </html>
    `);
});


app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    try {

        const result = await env.DB.prepare(`
            SELECT *
            FROM users
            WHERE username = ?
        `)
            .bind(username)
            .all();

        if (!result.results || result.results.length === 0) {

            return res
                .status(401)
                .send(
                    "Usuario o contraseña incorrectos."
                );
        }

        const user = result.results[0];

        const passwordCorrecta =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordCorrecta) {

            return res
                .status(401)
                .send(
                    "Usuario o contraseña incorrectos."
                );
        }

        await createSession(
            user.id,
            user.username,
            res
        );

        res.redirect("/admin");

    } catch (error) {

        console.error(error);

        res
            .status(500)
            .send("Error al iniciar sesión.");
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

app.post("/api/events", async (req, res) => {

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