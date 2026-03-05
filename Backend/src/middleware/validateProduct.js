function validateProduct(req, res, next) {
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });
    }

    if (price < 0 || stock < 0) {
        return res.status(400).json({
            error: "Precio y stock no pueden ser negativos"
        });
    }

    next();
}

module.exports = validateProduct;
