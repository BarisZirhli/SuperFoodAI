const { signup } = require("../controller/authController");
const { login } = require("../controller/authController");
const { getUserId } = require("../controller/authController");
const router = require("express").Router();

router.post("/signup", signup);

router.post("/login", login);
router.get("/getUserId", getUserId);

module.exports = router;
