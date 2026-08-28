function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export default function adminTemplate(users = [], sessionUserId = null) {

    const usersHtml = users.length === 0
        ? `
            <p class="vacio">
                No hay usuarios registrados.
            </p>
        `
        : `
            <ul class="usuarios">

                ${users.map(user => `
                    <li class="usuario">

                        <span class="usuario__nombre">
                            ${escapeHtml(user.username)}
                        </span>

                        ${
                            user.id === sessionUserId
                                ? `<span class="usuario__yo">Tú</span>`
                                : ""
                        }

                        <button
                            class="btn"
                            type="button"
                            onclick="changePassword('${user.id}', '${escapeHtml(user.username)}')"
                        >
                            Cambiar contraseña
                        </button>

                        ${
                            user.id === sessionUserId
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
                `).join("")}

            </ul>
        `;

    return `
<!DOCTYPE html>

<html lang="es" data-tema="papel">

<head>

    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>
        Administrar eventos - Kirkversario
    </title>

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

        [data-tema="noche"] {
            --fondo: #12103F;
            --texto: #F3EDDF;
            --tarjeta: #1B1857;

            --borde: rgba(243,237,223,.2);
            --fuerte: rgba(243,237,223,.45);
            --tenue: rgba(243,237,223,.58);
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
            max-width: 900px;

            margin: 0 auto;

            padding: 0 18px;
        }

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

        /* USERS */

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

        /* FORM */

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

        #message:empty {
            display: none;
        }

        /* EVENTS */

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

        .pie {
            border-top: 2px solid var(--texto);

            padding: 22px 0 36px;

            font-family: var(--mono);

            font-size: 11px;

            color: var(--tenue);

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
        }

        @media (prefers-reduced-motion: reduce) {

            * {
                transition: none !important;
                animation: none !important;
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

        <!-- USUARIOS -->

        <section>

            <h2>
                Usuarios registrados
            </h2>

            <p class="sub">
                Todas las cuentas que pueden administrar
                el Kirkversario.
            </p>

            <div id="usersList">

                ${usersHtml}

            </div>

        </section>


        <!-- NUEVO EVENTO -->

        <section>

            <h2>
                Nuevo evento
            </h2>

            <p class="sub">
                Rellena los datos y aparecerá en la portada.
                Al editar uno existente, el formulario se
                rellena solo.
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


        <!-- EVENTOS EXISTENTES -->

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

        async function deleteMyAccount() {

            const confirmed = confirm(
                "¿Seguro que quieres borrar tu cuenta?"
            );

            if (!confirmed) {
                return;
            }

            try {

                const response = await fetch(
                    "/api/users/me",
                    {
                        method: "DELETE"
                    }
                );

                console.log(
                    "Status:",
                    response.status
                );

                const texto =
                    await response.text();

                console.log(
                    "Respuesta:",
                    texto
                );

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

                console.error(
                    "ERROR FETCH:",
                    error
                );

                alert(
                    "Error de conexión con el servidor. " +
                    "Mira la consola (F12)."
                );
            }
        }


        const eventForm =
            document.getElementById("eventForm");

        const message =
            document.getElementById("message");

        const eventsList =
            document.getElementById("eventsList");

        let editingId = null;


        // ============================
        // TEMA
        // ============================

        document
            .getElementById("btnTema")
            .addEventListener("click", function () {

                const esNoche =
                    document.documentElement
                        .getAttribute("data-tema") === "noche";

                document.documentElement
                    .setAttribute(
                        "data-tema",
                        esNoche
                            ? "papel"
                            : "noche"
                    );

                this.textContent =
                    esNoche
                        ? "Noche"
                        : "Papel";
            });


        // ============================
        // CARGAR EVENTOS
        // ============================

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
                        document.createElement(
                            "article"
                        );

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


                    const category =
                        document.createElement("p");

                    category.className =
                        "evento__categoria";

                    category.textContent =
                        event.category ||
                        "general";


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


                    article.appendChild(date);

                    article.appendChild(category);

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


        // ============================
        // CREAR / EDITAR
        // ============================

        eventForm.addEventListener(
            "submit",
            async (event) => {

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
                            "/api/events/" +
                            editingId,
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


                    loadEvents();

                } else {

                    message.textContent =
                        data.error ||
                        "Ha ocurrido un error.";
                }

            }
        );


        // ============================
        // EDITAR EVENTO
        // ============================

        async function editEvent(id) {

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


            document
                .getElementById("title")
                .value =
                    event.title;


            document
                .getElementById("description")
                .value =
                    event.description || "";


            document
                .getElementById("date")
                .value =
                    event.date;


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
        }


        // ============================
        // ELIMINAR EVENTO
        // ============================

        async function deleteEvent(id) {

            const confirmar =
                confirm(
                    "¿Seguro que quieres eliminar este evento?"
                );

            if (!confirmar) {
                return;
            }


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
        }


        // ============================
        // CONTRASEÑAS
        // ============================

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
        }


        // ============================
        // ARRANQUE
        // ============================

        loadEvents();

    </script>

</body>

</html>
`;
}