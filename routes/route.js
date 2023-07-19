const express = require('express');
const controller = require("../controllers/payPalController")
const router = express();
const path = require('path');

router.set("view engine", "ejs");
router.set("views", path.join(__dirname, "../views"));

router.get("/", controller.renderBuyPage);
router.post("/pay", controller.payProduct);
router.get("/success", controller.successPage);
router.get("/cancel", controller.cancelPage);

module.exports = router