const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllPurchases,
  getMyPurchases
} = require("../controllers/purchaseController");

// ADMIN → ver todas
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  getAllPurchases
);

// CLIENT → ver solo las suyas
router.get(
  "/my",
  verifyToken,
  authorizeRoles("admin", "client"),
  getMyPurchases
);

module.exports = router;
