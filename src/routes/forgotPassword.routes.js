
const express = require('express');
const router = express.Router();
const forgotPasswordController = require("../controllers/forgotPassword.controller")

router.post("/", forgotPasswordController.forgotPassword);
router.put("/:id/:token", forgotPasswordController.restorePassword);

module.exports = router;
  

