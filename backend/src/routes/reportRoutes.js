const router = require("express").Router();
const c = require("../controllers/reportController");
const { protect, allow } = require("../middleware/auth");

router.use(protect, allow("admin", "reviewer", "officer"));

router.get("/category", c.byCategory);
router.get("/pending", c.pending);
router.get("/area", c.byArea);
router.get("/resolution", c.resolution);

module.exports = router;
