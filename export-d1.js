const Database = require("better-sqlite3");
const fs = require("fs");

const db = new Database("kirkversario.db", { readonly: true });

function sqlValue(value) {
    if (value === null || value === undefined) {
        return "NULL";
    }

    if (typeof value === "number") {
        return String(value);
    }

    return "'" + String(value).replace(/'/g, "''") + "'";
}

const users = db.prepare(`
    SELECT id, username, password
    FROM users
    ORDER BY id ASC
`).all();

const events = db.prepare(`
    SELECT id, title, description, date, time, category, user_id
    FROM events
    ORDER BY id ASC
`).all();

let sql = "";

sql += "-- Kirkversario D1 data export\n";
sql += "-- Generated from kirkversario.db\n\n";

sql += "PRAGMA foreign_keys = OFF;\n\n";

for (const user of users) {
    sql += `INSERT INTO users (id, username, password) VALUES (${sqlValue(user.id)}, ${sqlValue(user.username)}, ${sqlValue(user.password)});\n`;
}

sql += "\n";

for (const event of events) {
    sql += `INSERT INTO events (id, title, description, date, time, category, user_id) VALUES (${sqlValue(event.id)}, ${sqlValue(event.title)}, ${sqlValue(event.description)}, ${sqlValue(event.date)}, ${sqlValue(event.time)}, ${sqlValue(event.category)}, ${sqlValue(event.user_id)});\n`;
}

sql += "\nPRAGMA foreign_keys = ON;\n";

fs.writeFileSync("d1-data.sql", sql, "utf8");

console.log("=================================");
console.log("KIRKVERSARIO → D1");
console.log("=================================");
console.log(`Usuarios encontrados: ${users.length}`);
console.log(`Eventos encontrados:  ${events.length}`);
console.log("");
console.log("Archivo creado: d1-data.sql");
console.log("=================================");

db.close();