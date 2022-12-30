const express = require("express");
const api = express.Router();

const apiRouter = require("./api.router");
const loginRouter = require("./login.router");

api.use("/api", apiRouter);
api.use("/auth", loginRouter);

module.exports = api;