const { signup } = require("../controller/authController");
const { login } = require("../controller/authController");

const router = require("express").Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

module.exports = router;
