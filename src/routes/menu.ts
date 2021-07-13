const Router = require("express-promise-router");
import db from "../db";

const router = new Router();

module.exports = router;

// import express from "express";

// const router = express.Router();

// router.get("/ping", (req, res, next) => {
//   // res.send("pong").status(200);
//   db.query(`SELECT * FROM restaurants`, {}, (err: any, res: any) => {
//     if (err) {
//       return next(err);
//     }
//     res.send(res.rows[0]);
//   });
// });

router.get("/all", async (req: any, res: any) => {
  const { rows } = await db.query("SELECT * FROM restaurant");
  console.log("data", rows);
  res.send(rows);
});

router.get("/resaruant/", async (req: any, res: any) => {
  const { rows } = await db.query("SELECT * FROM restaurant");
  console.log("data", rows);
  res.send(rows);
});

module.exports = router;
