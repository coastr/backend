const express = require("express");
const router = express.Router();

module.exports = (app: any) => {
  // router.use("/menu", require("./menu"));
  // return router;
  app.use("/menu", require("./menu"));
  app.use("/restaurant", require("./restaurant"));
  return app;
};
