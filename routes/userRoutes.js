const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

router.get("/new", controller.new);

router.post("/new", controller.addingDetails);

router.get("/login", controller.login);

router.post("/login", controller.validate);

router.get("/profile", controller.profile);

router.get("/logout", controller.logout);

module.exports = router;
