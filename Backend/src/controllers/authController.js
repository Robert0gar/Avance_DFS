const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = "INSERT INTO users (email, password, role) VALUES (?, ?, 'client')";

        await db.execute(query, [email, hashedPassword]);
        res.status(201).json({ message: "Usuario registrado" });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = results[0];
        const valid = bcrypt.compareSync(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        next(err);
    }
};
