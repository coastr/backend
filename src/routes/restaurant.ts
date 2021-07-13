const Router = require("express-promise-router");
import restaurant from "../db/restaurant";
// import db from "../db";

const router = new Router();

module.exports = router;

router.get("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  console.log("id", id);
  const restaurants = await restaurant.getRestaurantById(id);
  console.log("restaurants", restaurants);
  res.send(restaurants);
});

router.get("/:id/menu", async (req: any, res: any) => {
  const { id } = req.params;
  const menu = await restaurant.getMenuByRestaurantId(id);
  console.log("menu", menu);
  res.send(menu).status(200);
});

// router.get("/menu/:id", async (req: any, res: any) => {
//   const { id } = req.params;
//   const { rows } = await db.query("SELECT * FROM restaurant");
//   console.log("data", rows);
//   res.send(rows);
// });
