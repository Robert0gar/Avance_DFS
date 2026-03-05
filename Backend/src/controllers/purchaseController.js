const db = require("../config/db");

// TODAS LAS COMPRAS (Admin)
exports.getAllPurchases = async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.id, u.email as user_email, pr.name as product_name, p.quantity, p.total, p.created_at 
            FROM purchases p
            JOIN users u ON p.user_id = u.id
            JOIN products pr ON p.product_id = pr.id
            ORDER BY p.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// MIS COMPRAS (Cliente)
exports.getMyPurchases = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(`
            SELECT p.id, pr.name as product_name, p.quantity, p.total, p.created_at 
            FROM purchases p
            JOIN products pr ON p.product_id = pr.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId]);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};