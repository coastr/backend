const Router = require("express-promise-router");
import menu from "../db/menu";

const router = new Router();

module.exports = router;

router.get("/item/:id/", async (req: any, res: any) => {
  const { id } = req.params;
  const options = await menu.getItemOptionsByItemId(id);
  console.log("options", options);
  res.send(options).status(200);
});

module.exports = router;
