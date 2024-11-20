const express = require("express");
const categoryController = require("../app/controllers/CategoryController");
const { verifyAccessToken, isAdmin } = require("../app/middlewares/jwt");
const router = express.Router();

router.get("/:id", categoryController.getById);
router.get("/", categoryController.getAll);
// router.post("/store", [verifyAccessToken, isAdmin], categoryController.store);
// router.put("/:id", [verifyAccessToken, isAdmin], categoryController.update);
router.post("/store", [verifyAccessToken], categoryController.store);
router.put("/:id", [verifyAccessToken], categoryController.update);
router.delete(
  "/:id/force",
  [verifyAccessToken, isAdmin],
  categoryController.forceDelete
);
// router.delete("/:id", [verifyAccessToken, isAdmin], categoryController.delete);
router.delete("/:id", [verifyAccessToken], categoryController.delete);
router.patch(
  "/:id/restore",
  [verifyAccessToken, isAdmin],
  categoryController.restore
);

module.exports = router;
