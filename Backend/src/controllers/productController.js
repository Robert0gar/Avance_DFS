const db = require("../config/db");

// 1. FUNCIÓN PARA LISTAR PRODUCTOS (La que faltaba)
exports.getProducts = async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    // Enviamos los productos al frontend
    res.json({ items: rows }); 
  } catch (err) {
    console.error("Error al obtener productos:", err);
    next(err);
  }
};

// 2. FUNCIÓN PARA COMPRAR (Tu lógica actual corregida)
exports.purchaseProduct = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { quantity } = req.body; 

    // VALIDACIÓN DE SEGURIDAD: Si req.user no existe, el servidor no crashea
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Usuario no identificado. Reinicia sesión." });
    }
    
    const userId = req.user.id; 

    const [products] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const product = products[0];

    if (product.stock < quantity) {
      return res.status(400).json({ error: "No hay suficiente stock disponible" });
    }

    const total = product.price * quantity;

    // Transacción básica para evitar errores de stock
    await db.execute("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, id]);
    
    await db.execute(
      "INSERT INTO purchases (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)",
      [userId, id, quantity, total]
    );

    res.json({ 
      message: "¡Compra realizada con éxito!", 
      newStock: product.stock - quantity 
    });
  } catch (err) {
    console.error("Error crítico en la compra:", err);
    next(err); // Esto evita que el proceso de Node.js muera
  }
};

// AGREGAR PRODUCTO (Solo Admin)
exports.createProduct = async (req, res, next) => {
    try {
        const { name, price, stock } = req.body;
        await db.execute(
            "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
            [name, price, stock]
        );
        res.status(201).json({ message: "Producto creado con éxito" });
    } catch (err) {
        next(err);
    }
};

// EDITAR PRODUCTO
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, stock } = req.body;
        await db.execute(
            "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?",
            [name, price, stock, id]
        );
        res.json({ message: "Producto actualizado" });
    } catch (err) {
        next(err);
    }
};

// ELIMINAR PRODUCTO
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM products WHERE id = ?", [id]);
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        next(err);
    }
};