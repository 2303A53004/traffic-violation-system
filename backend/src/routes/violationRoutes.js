const router = require("express").Router();
const c = require("../controllers/violationController");
const { protect, allow } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);

router.post("/", allow("citizen"), upload.array("evidence", 5), c.create);
router.get("/", c.list);
router.get("/:id", c.getOne);
router.patch("/:id/review", allow("reviewer", "admin"), c.review);
router.patch("/:id/assign", allow("admin"), c.assign);
router.patch("/:id/status", allow("officer", "admin"), c.updateStatus);

module.exports = router;
