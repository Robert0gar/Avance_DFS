const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const productController = require("../controllers/productController");


router.get("/", verifyToken, productController.getProducts);

router.post("/:id/buy", verifyToken, productController.purchaseProduct);


// --- RUTAS DE ADMINISTRADOR (Requiere rol 'admin') ---

router.post("/", 
    verifyToken, 
    authorizeRoles("admin"), 
    productController.createProduct
);

router.put("/:id", 
    verifyToken, 
    authorizeRoles("admin"), 
    productController.updateProduct
);

router.delete("/:id", 
    verifyToken, 
    authorizeRoles("admin"), 
    productController.deleteProduct
);

module.exports = router;