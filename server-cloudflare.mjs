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

        // ========================================================
        // CARGAR USUARIOS
        // ========================================================

        const result = await env.DB.prepare(`
            SELECT id, username
            FROM users
            ORDER BY username ASC
        `).all();

        const users = result.results || [];

        // ========================================================
        // HTML DE USUARIOS
        // ========================================================

        let usersHTML = "";

        if (users.length === 0) {

            usersHTML = `
                <p class="vacio">
                    No hay usuarios registrados.
                </p>
            `;

        } else {

            usersHTML = `
                <ul class="usuarios">
                    ${users.map(user => {

                        const esUsuarioActual =
                            Number(user.id) === Number(req.session.userId);

                        return `
                            <li class="usuario">

                                <span class="usuario__nombre">
                                    ${escapeHtml(user.username)}
                                </span>

                                ${
                                    esUsuarioActual
                                        ? `<span class="usuario__yo">Tú</span>`
                                        : ""
                                }

                                <button
                                    class="btn"
                                    type="button"
                                    onclick="changePassword(
                                        ${Number(user.id)},
                                        '${escapeHtml(user.username).replace(/'/g, "\\'")}'
                                    )"
                                >
                                    Cambiar contraseña
                                </button>

                                ${
                                    esUsuarioActual
                                        ? `
                                            <button
                                                class="btn btn--peligro"
                                                type="button"
                                                onclick="deleteMyAccount()"
                                            >
                                                Borrar mi cuenta
                                            </button>
                                        `
                                        : ""
                                }

                            </li>
                        `;

                    }).join("")}
                </ul>
            `;
        }

        // ========================================================
        // RESPUESTA
        // ========================================================

        res
            .status(200)
            .setHeader(
                "Content-Type",
                "text/html; charset=utf-8"
            )
            .send(`

<!DOCTYPE html>

<html lang="es" data-tema="papel">

<head>

<meta charset="utf-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1"
>

<title>Administrar eventos - Kirkversario</title>

<link rel="preconnect" href="https://fonts.googleapis.com">

<link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin
>

<link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
>

<style>

/* ============================================================
   VARIABLES
============================================================ */

:root {

    --fondo: #F3EDDF;
    --texto: #191552;
    --tarjeta: #FBF7EC;
    --rosa: #FF4A6E;
    --amarillo: #FFC233;

    --borde: rgba(25,21,82,.2);
    --fuerte: rgba(25,21,82,.5);
    --tenue: rgba(25,21,82,.55);

    --display:
        'Bricolage Grotesque',
        'Arial Black',
        sans-serif;

    --cuerpo:
        'Instrument Sans',
        system-ui,
        -apple-system,
        sans-serif;

    --mono:
        'DM Mono',
        ui-monospace,
        Menlo,
        monospace;
}


/* ============================================================
   TEMA NOCHE
============================================================ */

[data-tema="noche"] {

    --fondo: #12103F;
    --texto: #F3EDDF;
    --tarjeta: #1B1857;

    --borde: rgba(243,237,223,.2);
    --fuerte: rgba(243,237,223,.45);
    --tenue: rgba(243,237,223,.58);
}


/* ============================================================
   GENERAL
============================================================ */

* {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

body {

    margin: 0;

    background: var(--fondo);

    color: var(--texto);

    font-family: var(--cuerpo);

    font-size: 16px;

    line-height: 1.5;

    -webkit-font-smoothing: antialiased;
}

.env {

    max-width: 900px;

    margin: 0 auto;

    padding: 0 18px;
}


/* ============================================================
   CABECERA
============================================================ */

.top {

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 16px 18px;

    max-width: 900px;

    margin: 0 auto;

    border-bottom: 2px solid var(--texto);

    flex-wrap: wrap;
}

.top h1 {

    font-family: var(--display);

    font-weight: 800;

    font-size: 17px;

    text-transform: uppercase;

    letter-spacing: -.02em;

    margin: 0 auto 0 0;
}

.top h1 a {

    color: inherit;

    text-decoration: none;
}

.top h1 span {

    color: var(--rosa);
}


/* ============================================================
   BOTONES
============================================================ */

.btn {

    font-family: var(--mono);

    font-size: 11px;

    text-transform: uppercase;

    letter-spacing: .07em;

    background: transparent;

    color: var(--texto);

    border: 1.5px solid var(--texto);

    border-radius: 999px;

    padding: 7px 14px;

    cursor: pointer;

    text-decoration: none;

    display: inline-block;

    line-height: 1.3;
}

.btn:hover {

    background: var(--texto);

    color: var(--fondo);
}

.btn--peligro {

    border-color: var(--rosa);

    color: var(--rosa);
}

.btn--peligro:hover {

    background: var(--rosa);

    color: #FBF7EC;
}


/* ============================================================
   SECCIONES
============================================================ */

section {

    padding: 40px 0;
}

section + section {

    border-top: 2px solid var(--texto);
}

h2 {

    font-family: var(--display);

    font-weight: 800;

    font-size: clamp(22px, 3.6vw, 30px);

    letter-spacing: -.03em;

    margin: 0 0 6px;
}

.sub {

    color: var(--tenue);

    margin: 0 0 22px;

    max-width: 60ch;

    font-size: 15px;
}

.vacio {

    color: var(--tenue);

    font-size: 15px;
}


/* ============================================================
   USUARIOS
============================================================ */

.usuarios {

    display: grid;

    gap: 10px;

    list-style: none;

    margin: 0;

    padding: 0;
}

.usuario {

    display: flex;

    align-items: center;

    gap: 10px;

    flex-wrap: wrap;

    background: var(--tarjeta);

    border: 1.5px solid var(--borde);

    border-radius: 12px;

    padding: 12px 14px;
}

.usuario__nombre {

    font-family: var(--display);

    font-weight: 700;

    font-size: 17px;

    margin-right: auto;
}

.usuario__yo {

    font-family: var(--mono);

    font-size: 9px;

    text-transform: uppercase;

    letter-spacing: .1em;

    background: var(--amarillo);

    color: #191552;

    border-radius: 999px;

    padding: 4px 8px;
}


/* ============================================================
   FORMULARIO
============================================================ */

.formulario {

    background: var(--tarjeta);

    border: 2px solid var(--texto);

    border-radius: 14px;

    padding: 20px;
}

.rejilla {

    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 14px;
}

.campo {

    margin-bottom: 14px;
}

.et {

    font-family: var(--mono);

    font-size: 10px;

    text-transform: uppercase;

    letter-spacing: .1em;

    color: var(--tenue);

    display: block;

    margin-bottom: 4px;
}

input[type="text"],
input[type="date"],
input[type="time"],
textarea {

    background: var(--fondo);

    border: 1.5px solid var(--fuerte);

    border-radius: 8px;

    padding: 10px;

    font-family: var(--mono);

    font-size: 15px;

    width: 100%;

    color: inherit;

    min-height: 44px;
}

input:focus,
textarea:focus {

    border-color: var(--texto);
}

textarea {

    font-family: var(--cuerpo);

    font-size: 16px;

    resize: vertical;

    min-height: 90px;

    line-height: 1.4;
}

.enviar {

    min-height: 46px;

    padding: 0 26px;

    margin-top: 4px;

    font-family: var(--mono);

    font-size: 12px;

    text-transform: uppercase;

    letter-spacing: .09em;

    background: var(--rosa);

    color: #FBF7EC;

    border: 2px solid var(--texto);

    border-radius: 999px;

    cursor: pointer;
}

.enviar:hover {

    background: var(--texto);

    color: var(--fondo);
}

#message {

    margin: 16px 0 0;

    font-family: var(--mono);

    font-size: 12px;

    letter-spacing: .03em;

    border-left: 4px solid var(--amarillo);

    padding: 8px 0 8px 12px;
}


/* ============================================================
   EVENTOS
============================================================ */

.eventos {

    display: grid;

    gap: 12px;
}

.evento {

    background: var(--tarjeta);

    border: 2px solid var(--texto);

    border-radius: 14px;

    padding: 18px;
}

.evento h3 {

    font-family: var(--display);

    font-weight: 800;

    font-size: 24px;

    margin: 0 0 8px;
}

.evento p {

    margin: 6px 0;
}

.evento__fecha {

    font-family: var(--mono);

    font-size: 12px;

    color: var(--tenue);
}

.evento__categoria {

    display: inline-block;

    font-family: var(--mono);

    font-size: 10px;

    text-transform: uppercase;

    letter-spacing: .08em;

    border: 1px solid var(--borde);

    border-radius: 999px;

    padding: 5px 9px;

    color: var(--tenue);
}

.evento__acciones {

    display: flex;

    gap: 8px;

    margin-top: 14px;

    padding-top: 14px;

    border-top: 1px solid var(--borde);
}


/* ============================================================
   PIE
============================================================ */

.pie {

    border-top: 2px solid var(--texto);

    padding: 22px 0 36px;

    font-family: var(--mono);

    font-size: 11px;

    color: var(--tenue);

    text-transform: uppercase;

    letter-spacing: .07em;
}


/* ============================================================
   MÓVIL
============================================================ */

@media (max-width: 720px) {

    .rejilla {

        grid-template-columns: 1fr;
    }

    section {

        padding: 32px 0;
    }
}

</style>

</head>


<body>


<!-- ==========================================================
     CABECERA
=========================================================== -->

<header class="top">

    <h1>
        <a href="/">
            Kirkversario
            <span>Hail Hittler</span>
        </a>
    </h1>

    <a class="btn" href="/">
        Ver la web
    </a>

    <button
        class="btn"
        id="btnTema"
        type="button"
    >
        Noche
    </button>

</header>


<main class="env">


<!-- ==========================================================
     USUARIOS
=========================================================== -->

<section>

    <h2>
        Usuarios registrados
    </h2>

    <p class="sub">
        Todas las cuentas que pueden administrar el Kirkversario.
    </p>

    <div id="usersList">

        ${usersHTML}

    </div>

</section>


<!-- ==========================================================
     NUEVO EVENTO
=========================================================== -->

<section>

    <h2>
        Nuevo evento
    </h2>

    <p class="sub">
        Rellena los datos y aparecerá en la portada.
        Al editar uno existente, el formulario se rellena solo.
    </p>


    <form
        class="formulario"
        id="eventForm"
    >

        <div class="campo">

            <label
                class="et"
                for="title"
            >
                Título
            </label>

            <input
                type="text"
                id="title"
                name="title"
                required
            >

        </div>


        <div class="campo">

            <label
                class="et"
                for="description"
            >
                Descripción
            </label>

            <textarea
                id="description"
                name="description"
            ></textarea>

        </div>


        <div class="rejilla">

            <div class="campo">

                <label
                    class="et"
                    for="date"
                >
                    Fecha
                </label>

                <input
                    type="date"
                    id="date"
                    name="date"
                    required
                >

            </div>


            <div class="campo">

                <label
                    class="et"
                    for="time"
                >
                    Hora
                </label>

                <input
                    type="time"
                    id="time"
                    name="time"
                >

            </div>

        </div>


        <div class="campo">

            <label
                class="et"
                for="category"
            >
                Categoría
            </label>

            <input
                type="text"
                id="category"
                name="category"
                placeholder="general"
            >

        </div>


        <button
            class="enviar"
            type="submit"
        >
            Crear evento
        </button>

    </form>


    <p id="message"></p>

</section>


<!-- ==========================================================
     EVENTOS EXISTENTES
=========================================================== -->

<section>

    <h2>
        Eventos existentes
    </h2>

    <p class="sub">
        Todo lo que hay ahora mismo en el calendario.
    </p>

    <div id="eventsList"></div>

</section>


<div class="pie">

    Kirkversario · Panel de administración

</div>


</main>


<script>

/* ============================================================
   VARIABLES
============================================================ */

const eventForm =
    document.getElementById("eventForm");

const message =
    document.getElementById("message");

const eventsList =
    document.getElementById("eventsList");

let editingId = null;


/* ============================================================
   TEMA
============================================================ */

document
    .getElementById("btnTema")
    .addEventListener("click", function () {

        const esNoche =
            document.documentElement
                .getAttribute("data-tema") === "noche";

        document.documentElement.setAttribute(
            "data-tema",
            esNoche ? "papel" : "noche"
        );

        this.textContent =
            esNoche ? "Noche" : "Papel";
    });


/* ============================================================
   BORRAR MI CUENTA
============================================================ */

async function deleteMyAccount() {

    const confirmed = confirm(
        "¿Seguro que quieres borrar tu cuenta?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch("/api/users/me", {
                method: "DELETE"
            });

        const texto =
            await response.text();

        if (!response.ok) {

            alert(
                "Error del servidor: " +
                texto
            );

            return;
        }

        alert(
            "Cuenta eliminada correctamente."
        );

        window.location.href = "/login";

    } catch (error) {

        console.error(error);

        alert(
            "Error de conexión con el servidor."
        );
    }
}


/* ============================================================
   CARGAR EVENTOS
============================================================ */

async function loadEvents() {

    try {

        const response =
            await fetch("/api/events");

        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los eventos"
            );
        }

        const events =
            await response.json();

        eventsList.innerHTML = "";


        if (events.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "vacio";

            emptyMessage.textContent =
                "No hay eventos todavía.";

            eventsList.appendChild(
                emptyMessage
            );

            return;
        }


        const contenedor =
            document.createElement("div");

        contenedor.className =
            "eventos";


        events.forEach(event => {

            const article =
                document.createElement("article");

            article.className =
                "evento";


            const title =
                document.createElement("h3");

            title.textContent =
                event.title;

            article.appendChild(title);


            if (event.description) {

                const description =
                    document.createElement("p");

                description.textContent =
                    event.description;

                article.appendChild(
                    description
                );
            }


            const date =
                document.createElement("p");

            date.className =
                "evento__fecha";

            date.textContent =
                "📅 " +
                event.date +
                (
                    event.time
                        ? " — " + event.time
                        : ""
                );

            article.appendChild(date);


            const category =
                document.createElement("p");

            category.className =
                "evento__categoria";

            category.textContent =
                event.category || "general";

            article.appendChild(category);


            const acciones =
                document.createElement("div");

            acciones.className =
                "evento__acciones";


            const editButton =
                document.createElement("button");

            editButton.className =
                "btn";

            editButton.type =
                "button";

            editButton.textContent =
                "Editar";

            editButton.addEventListener(
                "click",
                function () {
                    editEvent(event.id);
                }
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "btn btn--peligro";

            deleteButton.type =
                "button";

            deleteButton.textContent =
                "Eliminar";

            deleteButton.addEventListener(
                "click",
                function () {
                    deleteEvent(event.id);
                }
            );


            acciones.appendChild(
                editButton
            );

            acciones.appendChild(
                deleteButton
            );

            article.appendChild(
                acciones
            );

            contenedor.appendChild(
                article
            );
        });


        eventsList.appendChild(
            contenedor
        );

    } catch (error) {

        console.error(error);

        eventsList.innerHTML =
            '<p class="vacio">' +
            'Error al cargar los eventos.' +
            '</p>';
    }
}


/* ============================================================
   CREAR / EDITAR EVENTO
============================================================ */

eventForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const eventData = {

            title:
                document
                    .getElementById("title")
                    .value,

            description:
                document
                    .getElementById("description")
                    .value,

            date:
                document
                    .getElementById("date")
                    .value,

            time:
                document
                    .getElementById("time")
                    .value,

            category:
                document
                    .getElementById("category")
                    .value
        };


        let response;


        if (editingId === null) {

            response =
                await fetch(
                    "/api/events",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );

        } else {

            response =
                await fetch(
                    "/api/events/" + editingId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                eventData
                            )
                    }
                );
        }


        const data =
            await response.json();


        if (response.ok) {

            message.textContent =
                editingId === null
                    ? "Evento creado correctamente."
                    : "Evento actualizado correctamente.";


            editingId = null;

            eventForm.reset();


            document
                .querySelector(
                    '#eventForm button[type="submit"]'
                )
                .textContent =
                    "Crear evento";


            loadEvents();

        } else {

            message.textContent =
                data.error ||
                "Ha ocurrido un error.";
        }
    }
);


/* ============================================================
   EDITAR EVENTO
============================================================ */

async function editEvent(id) {

    try {

        const response =
            await fetch("/api/events");

        const events =
            await response.json();

        const event =
            events.find(
                event => event.id === id
            );

        if (!event) {
            return;
        }


        document.getElementById("title").value =
            event.title;

        document.getElementById("description").value =
            event.description || "";

        document.getElementById("date").value =
            event.date;

        document.getElementById("time").value =
            event.time || "";

        document.getElementById("category").value =
            event.category || "";


        editingId = id;


        document
            .querySelector(
                '#eventForm button[type="submit"]'
            )
            .textContent =
                "Guardar cambios";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert(
            "No se pudo cargar el evento."
        );
    }
}


/* ============================================================
   ELIMINAR EVENTO
============================================================ */

async function deleteEvent(id) {

    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar este evento?"
        );

    if (!confirmar) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/events/" + id,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            message.textContent =
                "Evento eliminado correctamente.";

            loadEvents();

        } else {

            message.textContent =
                data.error ||
                "No se ha podido eliminar.";
        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Error de conexión.";
    }
}


/* ============================================================
   CAMBIAR CONTRASEÑA
============================================================ */

async function changePassword(
    userId,
    username
) {

    const newPassword =
        prompt(
            "Nueva contraseña para " +
            username +
            ":"
        );


    if (!newPassword) {
        return;
    }


    if (newPassword.length < 6) {

        alert(
            "La contraseña debe tener al menos 6 caracteres."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "/api/users/" +
                userId +
                "/password",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            password:
                                newPassword
                        })
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            alert(
                "Contraseña cambiada correctamente."
            );

        } else {

            alert(
                data.error ||
                "No se pudo cambiar la contraseña."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Error de conexión con el servidor."
        );
    }
}


/* ============================================================
   ARRANQUE
============================================================ */

loadEvents();

</script>

</body>

</html>

            `);

    } catch (error) {

        console.error(
            "ERROR ADMIN:",
            error
        );

        res
            .status(500)
            .send(
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