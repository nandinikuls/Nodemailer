const express = require("express");
const router = express.Router();

const mail = require("./app");

router.get("/getMail", mail.readMailbody);