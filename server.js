const express = require("express");
const Database = require("better-sqlite3");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// ============================
// CONFIGURACIÓN
// ============================

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: "kirkversario-secret",
        resave: false,
        saveUninitialized: false
    })
);

// ============================
// LOGIN
// ============================

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/register");
    }

    next();
}

// ============================
// ADMIN
// ============================

function requireAdmin(req, res, next) {
    if (!req.session?.userId) {
        return res.redirect("/");
    }

    try {
        const user = db.prepare(`
            SELECT is_admin
            FROM users
            WHERE id = ?
        `).get(req.session.userId);

        if (!user || Number(user.is_admin) !== 1) {
            return res.redirect("/");
        }

        next();

    } catch (error) {
        console.error("ERROR COMPROBANDO ADMIN:", error);
        return res.redirect("/");
    }
}

// ============================
// BASE DE DATOS
// ============================

const db = new Database("kirkversario.db");

// Tabla de usuarios
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();

// Tabla de eventos
db.prepare(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT,
        category TEXT
    )
`).run();

// Añadir user_id si la base de datos antigua no lo tiene
try {
    db.prepare(`
        ALTER TABLE events
        ADD COLUMN user_id INTEGER
    `).run();
} catch (error) {
    // La columna ya existe
}

// ============================
// HOME
// ============================

app.get("/", requireLogin, (req, res) => {
    const events = db.prepare(`
        SELECT *
        FROM events
        ORDER BY date ASC, time ASC
    `).all();

    res.render("home", {
        events
    });
});

// ============================
// REGISTRO
// ============================

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .send("Usuario y contraseña son obligatorios.");
    }

    if (password.length < 6) {
        return res
            .status(400)
            .send("La contraseña debe tener al menos 6 caracteres.");
    }

    const existingUser = db.prepare(`
        SELECT id
        FROM users
        WHERE username = ?
    `).get(username);

    if (existingUser) {
        return res
            .status(400)
            .send("Ese nombre de usuario ya existe.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `).run(username, hashedPassword);

    res.redirect("/login");
});

// ============================
// LOGIN
// ============================

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .send("Usuario y contraseña son obligatorios.");
    }

    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE username = ?
    `).get(username);

    if (!user) {
        return res
            .status(401)
            .send("Usuario o contraseña incorrectos.");
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordCorrecta) {
        return res
            .status(401)
            .send("Usuario o contraseña incorrectos.");
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect("/admin");
});

// ============================
// CAMBIAR CONTRASEÑA
// ============================

app.put(
    "/api/users/:id/password",
    requireLogin,
    async (req, res) => {

        const userId = Number(req.params.id);
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: "La contraseña es obligatoria."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "La contraseña debe tener al menos 6 caracteres."
            });
        }

        const user = db.prepare(`
            SELECT id
            FROM users
            WHERE id = ?
        `).get(userId);

        if (!user) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        db.prepare(`
            UPDATE users
            SET password = ?
            WHERE id = ?
        `).run(
            hashedPassword,
            userId
        );

        res.json({
            message: "Contraseña cambiada correctamente."
        });
    }
);

// ============================
// BORRAR MI CUENTA
// ============================

app.delete(
    "/api/users/me",
    requireLogin,
    (req, res) => {

        const userId = req.session.userId;

        const result = db.prepare(`
            DELETE FROM users
            WHERE id = ?
        `).run(userId);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        req.session.destroy((error) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "No se pudo cerrar la sesión."
                });
            }

            res.json({
                message: "Cuenta eliminada correctamente."
            });
        });
    }
);

// ============================
// EVENTOS - OBTENER
// ============================

app.get("/api/events", (req, res) => {

    const events = db.prepare(`
        SELECT *
        FROM events
        ORDER BY date ASC, time ASC
    `).all();

    res.json(events);
});

// ============================
// EVENTOS - CREAR
// ============================

app.post("/api/events", requireLogin, (req, res) => {

    const {
        title,
        description,
        date,
        time,
        category
    } = req.body;

    if (!title || !date) {
        return res.status(400).json({
            error: "El título y la fecha son obligatorios."
        });
    }

    const result = db.prepare(`
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
    `).run(
        title,
        description || "",
        date,
        time || "",
        category || "general",
        req.session.userId
    );

    res.json({
        message: "Evento creado correctamente.",
        id: result.lastInsertRowid
    });
});

// ============================
// EVENTOS - EDITAR
// ============================

app.put(
    "/api/events/:id",
    requireLogin,
    (req, res) => {

        const eventId = Number(req.params.id);

        const {
            title,
            description,
            date,
            time,
            category
        } = req.body;

        if (!title || !date) {
            return res.status(400).json({
                error: "El título y la fecha son obligatorios."
            });
        }

        const event = db.prepare(`
            SELECT id
            FROM events
            WHERE id = ?
        `).get(eventId);

        if (!event) {
            return res.status(404).json({
                error: "Evento no encontrado."
            });
        }

        db.prepare(`
            UPDATE events
            SET
                title = ?,
                description = ?,
                date = ?,
                time = ?,
                category = ?
            WHERE id = ?
        `).run(
            title,
            description || "",
            date,
            time || "",
            category || "general",
            eventId
        );

        res.json({
            message: "Evento actualizado correctamente."
        });
    }
);

// ============================
// EVENTOS - BORRAR
// ============================

app.delete(
    "/api/events/:id",
    requireLogin,
    (req, res) => {

        const eventId = Number(req.params.id);

        const result = db.prepare(`
            DELETE FROM events
            WHERE id = ?
        `).run(eventId);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Evento no encontrado."
            });
        }

        res.json({
            message: "Evento eliminado correctamente."
        });
    }
);

// ============================
// ARRANCAR SERVIDOR
// ============================

app.listen(PORT, () => {
    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );
});
