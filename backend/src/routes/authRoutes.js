const router = require("express").Router();
const c = require("../controllers/authController");
const { protect, allow } = require("../middleware/auth");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/users", protect, allow("admin"), c.createUser);
router.get("/users", protect, allow("admin", "reviewer"), c.listUsers);

module.exports = router;
