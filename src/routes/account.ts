// const Router = require("express-promise-router");
import express from "express";
import account from "../db/account";
import { NextFunction, Request, Response } from "express";

import { authenticateAccount } from "../middleware/auth";

const router = express.Router();

router.use(authenticateAccount);

router.get("/", async (req: Request, res: Response) => {
  const { firebaseId } = req.body;
  const userProfile = await account.getAccountByFirebaseId(firebaseId);

  console.log("userProfile", userProfile);

  res.status(200).send(userProfile);
});

router.post("/new", async (req: Request, res: Response) => {
  try {
    const { name, email, firebaseId } = req.body;
    await account.postAccount({ name, email, firebaseId });
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
