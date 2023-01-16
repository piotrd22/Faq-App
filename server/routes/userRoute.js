const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, userController.getAllUsers);

router.get("/:id", verifyToken, userController.getUser);

router.put("/:id", verifyToken, userController.updateUser);

router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
