const Router = require("express-promise-router");
import restaurant from "../db/restaurant";

import { Request, Response } from "express";

const router = new Router();

module.exports = router;

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id", id);
  const restaurants = await restaurant.getRestaurantById(id);
  console.log("restaurants", restaurants);

  res.status(200).send(restaurants);
});

router.get("/:id/menu", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("req.headers", req.headers);
  const menu = await restaurant.getMenuByRestaurantId(id);
  console.log("menu", menu);

  res.status(200).send(menu);
});
