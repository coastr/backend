const express = require("express");
const router = express.Router();

module.exports = (app: any) => {
  app.use("/menu", require("./menu"));
  app.use("/restaurant", require("./restaurant"));
  app.use("/account", require("./account"));
  return app;
};
