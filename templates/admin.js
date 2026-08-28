export default `
<!DOCTYPE html>
<html lang="es" data-tema="papel">

<head>
    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>Administrar eventos - Kirkversario</title>

    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
    >

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

        :root {
            --fondo: #F3EDDF;
            --texto: #191552;
            --tarjeta: #FBF7EC;
            --rosa: #FF4A6E;
            --amarillo: #FFC233;

            --borde: rgba(25, 21, 82, .2);
            --fuerte: rgba(25, 21, 82, .5);
            --tenue: rgba(25, 21, 82, .55);

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
                ui-monospace,
                Menlo,
                monospace;
        }

        [data-tema="noche"] {
            --fondo: #12103F;
            --texto: #F3EDDF;
            --tarjeta: #1B1857;

            --borde: rgba(243, 237, 223, .2);
            --fuerte: rgba(243, 237, 223, .45);
            --tenue: rgba(243, 237, 223, .58);
        }

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
            width: 100%;
            max-width: 900px;

            margin: 0 auto;
            padding: 0 18px;
        }

        .top {
            display: flex;
            align-items: center;
            gap: 10px;

            max-width: 900px;
            margin: 0 auto;

            padding: 16px 18px;

            border-bottom: 2px solid var(--texto);

            flex-wrap: wrap;
        }

        .top h1 {
            margin: 0 auto 0 0;

            font-family: var(--display);
            font-size: 17px;
            font-weight: 800;

            text-transform: uppercase;
            letter-spacing: -.02em;
        }

        .top h1 a {
            color: inherit;
            text-decoration: none;
        }

        .top h1 span {
            color: var(--rosa);
        }

        .btn {
            display: inline-block;

            padding: 7px 14px;

            border: 1.5px solid var(--texto);
            border-radius: 999px;

            background: transparent;
            color: var(--texto);

            font-family: var(--mono);
            font-size: 11px;

            text-transform: uppercase;
            letter-spacing: .07em;

            cursor: pointer;
            text-decoration: none;
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

        .enviar {
            min-height: 46px;

            padding: 0 26px;
            margin-top: 4px;

            border: 2px solid var(--texto);
            border-radius: 999px;

            background: var(--rosa);
            color: #FBF7EC;

            font-family: var(--mono);
            font-size: 12px;

            text-transform: uppercase;
            letter-spacing: .09em;

            cursor: pointer;
        }

        .enviar:hover {
            background: var(--texto);
            color: var(--fondo);
        }

        :focus-visible {
            outline: 3px solid var(--rosa);
            outline-offset: 2px;
        }

        section {
            padding: 40px 0;
        }

        section + section {
            border-top: 2px solid var(--texto);
        }

        h2 {
            margin: 0 0 6px;

            font-family: var(--display);
            font-size: clamp(22px, 3.6vw, 30px);
            font-weight: 800;

            letter-spacing: -.03em;
        }

        .sub {
            max-width: 60ch;

            margin: 0 0 22px;

            color: var(--tenue);

            font-size: 15px;
        }

        .vacio {
            color: var(--tenue);
            font-size: 15px;
        }

        /* =========================
           USUARIOS
        ========================= */

        .usuarios {
            display: grid;
            gap: 10px;

            margin: 0;
            padding: 0;

            list-style: none;
        }

        .usuario {
            display: flex;
            align-items: center;
            gap: 10px;

            padding: 12px 14px;

            border: 1.5px solid var(--borde);
            border-radius: 12px;

            background: var(--tarjeta);

            flex-wrap: wrap;
        }

        .usuario__nombre {
            margin-right: auto;

            font-family: var(--display);
            font-size: 17px;
            font-weight: 700;
        }

        .usuario__yo {
            padding: 4px 8px;

            border-radius: 999px;

            background: var(--amarillo);
            color: #191552;

            font-family: var(--mono);
            font-size: 9px;

            text-transform: uppercase;
            letter-spacing: .1em;
        }

        /* =========================
           FORMULARIO
        ========================= */

        .formulario {
            padding: 20px;

            border: 2px solid var(--texto);
            border-radius: 14px;

            background: var(--tarjeta);
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
            display: block;

            margin-bottom: 4px;

            color: var(--tenue);

            font-family: var(--mono);
            font-size: 10px;

            text-transform: uppercase;
            letter-spacing: .1em;
        }

        input[type="text"],
        input[type="date"],
        input[type="time"],
        textarea {
            width: 100%;
            min-height: 44px;

            padding: 10px;

            border: 1.5px solid var(--fuerte);
            border-radius: 8px;

            background: var(--fondo);
            color: inherit;

            font-family: var(--mono);
            font-size: 15px;
        }

        input:focus,
        textarea:focus {
            border-color: var(--texto);
        }

        textarea {
            min-height: 90px;

            font-family: var(--cuerpo);
            font-size: 16px;

            line-height: 1.4;
            resize: vertical;
        }

        #message {
            margin: 16px 0 0;

            padding: 8px 0 8px 12px;

            border-left: 4px solid var(--amarillo);

            font-family: var(--mono);
            font-size: 12px;
            letter-spacing: .03em;
        }

        #message:empty {
            display: none;
        }

        /* =========================
           EVENTOS
        ========================= */

        .eventos {
            display: grid;
            gap: 12px;
        }

        .evento {
            padding: 18px;

            border: 2px solid var(--texto);
            border-radius: 14px;

            background: var(--tarjeta);
        }

        .evento h3 {
            margin: 0 0 8px;

            font-family: var(--display);
            font-size: 24px;
            font-weight: 800;
        }

        .evento p {
            margin: 6px 0;
        }

        .evento__fecha {
            color: var(--tenue);

            font-family: var(--mono);
            font-size: 12px;
        }

        .evento__categoria {
            display: inline-block;

            padding: 5px 9px;

            border: 1px solid var(--borde);
            border-radius: 999px;

            color: var(--tenue);

            font-family: var(--mono);
            font-size: 10px;

            text-transform: uppercase;
            letter-spacing: .08em;
        }

        .evento__acciones {
            display: flex;
            gap: 8px;

            margin-top: 14px;
            padding-top: 14px;

            border-top: 1px solid var(--borde);

            flex-wrap: wrap;
        }

        .pie {
            padding: 22px 0 36px;

            border-top: 2px solid var(--texto);

            color: var(--tenue);

            font-family: var(--mono);
            font-size: 11px;

            text-transform: uppercase;
            letter-spacing: .07em;
        }

        @media (max-width: 720px) {

            .rejilla {
                grid-template-columns: 1fr;
            }

            section {
                padding: 32px 0;
            }

            .usuario {
                align-items: flex-start;
                flex-direction: column;
            }

            .usuario__nombre {
                margin-right: 0;
            }

        }

    </style>
</head>

<body>

<header class="top">

    <h1>
        <a href="/">
            Kirkversario
            <span>Hail Hittler</span>
        </a>
    </h1>

    <a
        class="btn"
        href="/"
    >
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

    <!-- =========================
         USUARIOS
    ========================== -->

    <section>

        <h2>Usuarios registrados</h2>

        <p class="sub">
            Todas las cuentas que pueden administrar el Kirkversario.
        </p>

        <div id="usersList">

            <% if (!users || users.length === 0) { %>

                <p class="vacio">
                    No hay usuarios registrados.
                </p>

            <% } else { %>

                <ul class="usuarios">

                    <% users.forEach(function(user) { %>

                        <li class="usuario">

                            <span class="usuario__nombre">
                                <%= user.username %>
                            </span>

                            <% if (user.id === sessionUserId) { %>

                                <span class="usuario__yo">
                                    Tú
                                </span>

                            <% } %>

                            <button
                                class="btn"
                                type="button"
                                onclick="changePassword('<%= user.id %>', '<%= user.username %>')"
                            >
                                Cambiar contraseña
                            </button>

                            <% if (user.id === sessionUserId) { %>

                                <button
                                    class="btn btn--peligro"
                                    type="button"
                                    onclick="deleteMyAccount()"
                                >
                                    Borrar mi cuenta
                                </button>

                            <% } %>

                        </li>

                    <% }); %>

                </ul>

            <% } %>

        </div>

    </section>


    <!-- =========================
         CREAR EVENTO
    ========================== -->

    <section>

        <h2>Nuevo evento</h2>

        <p class="sub">
            Rellena los datos y aparecerá en la portada.
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


    <!-- =========================
         EVENTOS EXISTENTES
    ========================== -->

    <section>

        <h2>Eventos existentes</h2>

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

"use strict";


/* ============================================================
   ELEMENTOS
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

        const noche =
            document.documentElement
                .getAttribute("data-tema") === "noche";

        document.documentElement
            .setAttribute(
                "data-tema",
                noche ? "papel" : "noche"
            );

        this.textContent =
            noche ? "Noche" : "Papel";
    });


/* ============================================================
   CARGAR EVENTOS
============================================================ */

async function loadEvents() {

    try {

        const response =
            await fetch("/api/events");

        if (!response.ok) {
            throw new Error(
                "No se pudieron cargar los eventos."
            );
        }

        const events =
            await response.json();

        eventsList.innerHTML = "";


        if (!events || events.length === 0) {

            const empty =
                document.createElement("p");

            empty.className = "vacio";

            empty.textContent =
                "No hay eventos todavía.";

            eventsList.appendChild(empty);

            return;
        }


        const container =
            document.createElement("div");

        container.className = "eventos";


        events.forEach(function (event) {

            const article =
                document.createElement("article");

            article.className = "evento";


            const title =
                document.createElement("h3");

            title.textContent =
                event.title || "";

            article.appendChild(title);


            if (event.description) {

                const description =
                    document.createElement("p");

                description.textContent =
                    event.description;

                article.appendChild(description);
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


            const actions =
                document.createElement("div");

            actions.className =
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


            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            article.appendChild(actions);

            container.appendChild(article);

        });


        eventsList.appendChild(container);

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
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

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
                    .trim()

        };


        let response;


        try {

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
                                JSON.stringify(eventData)
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
                                JSON.stringify(eventData)
                        }
                    );
            }


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.error ||
                    "Ha ocurrido un error.";

                return;
            }


            if (editingId === null) {

                message.textContent =
                    "Evento creado correctamente.";

            } else {

                message.textContent =
                    "Evento actualizado correctamente.";
            }


            editingId = null;

            eventForm.reset();


            document
                .querySelector(
                    '#eventForm button[type="submit"]'
                )
                .textContent =
                "Crear evento";


            await loadEvents();

        } catch (error) {

            console.error(error);

            message.textContent =
                "Error de conexión con el servidor.";
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

        if (!response.ok) {
            throw new Error(
                "No se pudieron cargar los eventos."
            );
        }

        const events =
            await response.json();


        const event =
            events.find(function (item) {
                return item.id === id;
            });


        if (!event) {
            return;
        }


        document
            .getElementById("title")
            .value =
            event.title || "";


        document
            .getElementById("description")
            .value =
            event.description || "";


        document
            .getElementById("date")
            .value =
            event.date || "";


        document
            .getElementById("time")
            .value =
            event.time || "";


        document
            .getElementById("category")
            .value =
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

        message.textContent =
            "No se pudo cargar el evento.";
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


        if (!response.ok) {

            message.textContent =
                data.error ||
                "No se ha podido eliminar.";

            return;
        }


        message.textContent =
            "Evento eliminado correctamente.";


        await loadEvents();


    } catch (error) {

        console.error(error);

        message.textContent =
            "Error de conexión con el servidor.";
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
                            password: newPassword
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "No se pudo cambiar la contraseña."
            );

            return;
        }


        alert(
            "Contraseña cambiada correctamente."
        );


    } catch (error) {

        console.error(error);

        alert(
            "Error de conexión con el servidor."
        );
    }
}


/* ============================================================
   BORRAR MI CUENTA
============================================================ */

async function deleteMyAccount() {

    const confirmed =
        confirm(
            "¿Seguro que quieres borrar tu cuenta? " +
            "Esta acción no se puede deshacer."
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/users/me",
                {
                    method: "DELETE"
                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            alert(
                "Error del servidor: " +
                text
            );

            return;
        }


        alert(
            "Cuenta eliminada correctamente."
        );


        window.location.href =
            "/login";


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
`;