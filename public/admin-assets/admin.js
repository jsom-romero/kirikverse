// ============================================================
// ADMIN — JAVASCRIPT
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const eventForm =
    document.getElementById("eventForm");

const message =
    document.getElementById("message");

const eventsList =
    document.getElementById("eventsList");

const btnTema =
    document.getElementById("btnTema");

const colorPalette =
    document.getElementById("colorPalette");

const colorInput =
    document.getElementById("color");

let editingId = null;


// ============================================================
// PALETA DE COLORES
// ============================================================

function seleccionarColor(color) {

    if (!colorInput) {
        return;
    }

    colorInput.value =
        color;

    if (!colorPalette) {
        return;
    }

    colorPalette
        .querySelectorAll(".color-option")
        .forEach(function (button) {

            button.classList.remove(
                "color-option--selected"
            );

        });

    const seleccionado =
        colorPalette.querySelector(
            '[data-color="' + color + '"]'
        );

    if (seleccionado) {

        seleccionado.classList.add(
            "color-option--selected"
        );
    }
}


if (colorPalette && colorInput) {

    colorPalette
        .querySelectorAll(".color-option")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    seleccionarColor(
                        this.dataset.color
                    );

                }
            );

        });

    seleccionarColor(
        colorInput.value ||
        "#6366f1"
    );
}


// ============================================================
// ELIMINAR USUARIO
// ============================================================

async function deleteUser(userId) {

    const confirmar = confirm(
        "¿Seguro que quieres eliminar este usuario?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const response = await fetch(
            "/api/users/" + userId,
            {
                method: "DELETE"
            }
        );

        const data =
            await response.json();

        if (response.ok) {

            alert(
                "Usuario eliminado correctamente."
            );

            location.reload();

        } else {

            alert(
                data.error ||
                "No se pudo eliminar el usuario."
            );
        }

    } catch (error) {

        console.error(
            "ERROR DELETE USER:",
            error
        );

        alert(
            "Error de conexión con el servidor."
        );
    }
}


// ============================================================
// TEMA
// ============================================================

if (btnTema) {

    btnTema.addEventListener(
        "click",
        function () {

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
        }
    );
}


// ============================================================
// CARGAR EVENTOS
// ============================================================

async function loadEvents() {

    if (!eventsList) {
        return;
    }

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


        if (
            !Array.isArray(events) ||
            events.length === 0
        ) {

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


            // COLOR DEL EVENTO

            article.style.backgroundColor = "";
            
            article.style.borderLeftColor =
                event.color || "#6366f1";

            // TÍTULO

            const title =
                document.createElement("h3");

            title.textContent =
                event.title || "";

            article.appendChild(
                title
            );


            // DESCRIPCIÓN

            if (event.description) {

                const description =
                    document.createElement("p");

                description.textContent =
                    event.description;

                article.appendChild(
                    description
                );
            }


            // FECHA

            const date =
                document.createElement("p");

            date.className =
                "evento__fecha";

            date.textContent =
                "📅 " +
                (event.date || "") +
                (
                    event.time
                        ? " — " + event.time
                        : ""
                );

            article.appendChild(
                date
            );


            // CATEGORÍA

            const category =
                document.createElement("p");

            category.className =
                "evento__categoria";

            category.textContent =
                event.category ||
                "general";

            article.appendChild(
                category
            );


            // ACCIONES

            const acciones =
                document.createElement("div");

            acciones.className =
                "evento__acciones";


            // EDITAR

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


            // ELIMINAR

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

        console.error(
            "ERROR CARGANDO EVENTOS:",
            error
        );

        eventsList.innerHTML =
            '<p class="vacio">' +
            'Error al cargar los eventos.' +
            '</p>';
    }
}


// ============================================================
// CREAR / EDITAR EVENTO
// ============================================================

if (eventForm) {

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
                        .value,

                color:
                    document
                        .getElementById("color")
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


                seleccionarColor(
                    "#6366f1"
                );


                const submitButton =
                    eventForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.textContent =
                        "Crear evento";
                }


                await loadEvents();


            } else {

                message.textContent =
                    data.error ||
                    "Ha ocurrido un error.";
            }

        }
    );
}


// ============================================================
// EDITAR EVENTO
// ============================================================

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
            events.find(
                item =>
                    Number(item.id) === Number(id)
            );


        if (!event) {

            alert(
                "No se ha encontrado el evento."
            );

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


        // SELECCIONAR COLOR DEL EVENTO

        seleccionarColor(
            event.color || "#6366f1"
        );


        editingId =
            Number(id);


        const submitButton =
            eventForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.textContent =
                "Guardar cambios";
        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(
            "ERROR EDITANDO EVENTO:",
            error
        );

        if (message) {

            message.textContent =
                "No se pudo cargar el evento.";
        }
    }
}


// ============================================================
// ELIMINAR EVENTO
// ============================================================

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

            await loadEvents();

        } else {

            message.textContent =
                data.error ||
                "No se ha podido eliminar.";
        }


    } catch (error) {

        console.error(
            "ERROR ELIMINANDO EVENTO:",
            error
        );

        message.textContent =
            "Error de conexión con el servidor.";
    }
}


// ============================================================
// CAMBIAR CONTRASEÑA
// ============================================================

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

        console.error(
            "ERROR CAMBIANDO CONTRASEÑA:",
            error
        );

        alert(
            "Error de conexión con el servidor."
        );
    }
}


// ============================================================
// ARRANQUE
// ============================================================

loadEvents();
