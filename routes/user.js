const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup route
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login route
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) ,userController.login);

router.get("/logout", userController.logout);

module.exports = router;