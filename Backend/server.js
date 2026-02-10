require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido" });
        }
        req.userId = decoded.id;
        next();
    });
}

app.post("/api/register", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.execute(query, [email, hashedPassword], err => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Usuario registrado" });
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";

    db.execute(query, [email], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = results[0];
        const valid = bcrypt.compareSync(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    });
});

app.get("/api/products", (req, res) => {
    const query = "SELECT * FROM products ORDER BY created_at DESC";

    db.execute(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post("/api/products", verifyToken, (req, res) => {
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = `
        INSERT INTO products (name, price, stock)
        VALUES (?, ?, ?)
    `;

    db.execute(query, [name, price, stock], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({
            message: "Producto agregado",
            id: results.insertId
        });
    });
});

app.put("/api/products/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const query = `
        UPDATE products
        SET name = ?, price = ?, stock = ?
        WHERE id = ?
    `;

    db.execute(query, [name, price, stock, id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado" });
    });
});

app.delete("/api/products/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM products WHERE id = ?";

    db.execute(query, [id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado" });
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor en http://localhost:${process.env.PORT}`);
});
