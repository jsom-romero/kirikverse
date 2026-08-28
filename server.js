const express = require("express");
const Database = require("better-sqlite3");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// ============================
// CONFIGURATION
// ============================

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "kirkversario-secret",
    resave: false,
    saveUninitialized: false
}));

function requireLogin(req, res, next) {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
}

// ============================
// DATABASE
// ============================

const db = new Database("kirkversario.db");

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

try {
    db.prepare(`
        ALTER TABLE events
        ADD COLUMN user_id INTEGER
    `).run();
} catch (error) {
    // La columna ya existe
}

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();


// ============================
// ROUTES
// ============================


// Admin page
app.get("/admin", requireLogin, (req, res) => {

    const users = db.prepare(`
        SELECT id, username
        FROM users
        ORDER BY username ASC
    `).all();

    res.render("admin", {
        users: users,
        sessionUserId: req.session.userId
    });
});


//Delete self Page
app.delete("/api/users/me", requireLogin, (req, res) => {

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
});


//Delete Users Page
app.get("/admin", requireLogin, (req, res) => {

    const users = db.prepare(`
        SELECT id, username
        FROM users
        ORDER BY username ASC
    `).all();

    res.render("admin", {
        users: users,
        sessionUserId: req.session.userId
    });
});


// Home page
app.get("/", (req, res) => {

    const events = db.prepare(`
        SELECT *
        FROM events
        ORDER BY date ASC, time ASC
    `).all();

    res.render("home", {
        events: events
    });
});

//Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Usuario y contraseña son obligatorios.");
    }

    if (password.length < 6) {
        return res.status(400).send("La contraseña debe tener al menos 6 caracteres.");
    }

    const existingUser = db.prepare(`
        SELECT id
        FROM users
        WHERE username = ?
    `).get(username);

    if (existingUser) {
        return res.status(400).send("Ese nombre de usuario ya existe.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `).run(username, hashedPassword);

    res.redirect("/login");
});


// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE username = ?
    `).get(username);

    if (!user) {
        return res.status(401).send("Usuario o contraseña incorrectos.");
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordCorrecta) {
        return res.status(401).send("Usuario o contraseña incorrectos.");
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect("/admin");
});

//Users
app.put("/api/users/:id/password", requireLogin, async (req, res) => {

    const userId = req.params.id;
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = db.prepare(`
        UPDATE users
        SET password = ?
        WHERE id = ?
    `).run(
        hashedPassword,
        userId
    );

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Usuario no encontrado."
        });
    }

    res.json({
        message: "Contraseña cambiada correctamente."
    });
});


// Get all events
app.get("/api/events", (req, res) => {

    const events = db.prepare(`
        SELECT *
        FROM events
        ORDER BY date ASC, time ASC
    `).all();

    res.json(events);
});


// Create an event
app.post("/api/events", (req, res) => {

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

    const result = db.prepare(`
        INSERT INTO events
        (title, description, date, time, category, user_id)
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
        message: "Event created",
        id: result.lastInsertRowid
    });
});


// Update an event
app.put("/api/events/:id", (req, res) => {

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

    const result = db.prepare(`
        UPDATE events
        SET title = ?,
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

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Event not found"
        });
    }

    res.json({
        message: "Event updated"
    });
});


// Delete an event
app.delete("/api/events/:id", (req, res) => {

    const eventId = req.params.id;

    const result = db.prepare(`
        DELETE FROM events
        WHERE id = ?
    `).run(eventId);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Event not found"
        });
    }

    res.json({
        message: "Event deleted"
    });
});


// ============================
// START SERVER
// ============================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
