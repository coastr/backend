const Router = require("express-promise-router");
import menu from "../db/menu";

import { Request, Response } from "express";

const router = new Router();

module.exports = router;

router.get("/item/:id/", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("req.headers", req.headers);

  const options = await menu.getItemOptionsByItemId(id);
  res.send(options).status(200);
});

module.exports = router;
