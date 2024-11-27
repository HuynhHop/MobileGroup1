const express = require("express");
const { verifyAccessToken, isAdmin } = require("../app/middlewares/jwt");
const orderController = require("../app/controllers/OrderController");
const router = express.Router();

router.get(
  "/getAllsByUser",
  [verifyAccessToken],
  orderController.getAllsByUser
);
router.get(
  "/getAll",
  [verifyAccessToken, isAdmin],
  orderController.getAllByAdmin
);
router.get(
  "/getOrderByUser",
  [verifyAccessToken],
  orderController.getOrdersByUser
);
router.get(
  "/byTime",
  [verifyAccessToken, isAdmin],
  orderController.getOrdersByTimes
);
router.get("/:id", [verifyAccessToken], orderController.getById);
router.get("/", [verifyAccessToken], orderController.getOrders);

router.post("/checkout", [verifyAccessToken], orderController.checkout);
router.put(
  "/updateStatus/:id",
  [verifyAccessToken, isAdmin],
  orderController.updateStatus
);

router.put(
  "/updateIsDelivered/:id",
  [verifyAccessToken, isAdmin],
  orderController.updateIsDelivered
);

router.put("/:id", verifyAccessToken, orderController.deleteByUser);

module.exports = router;
