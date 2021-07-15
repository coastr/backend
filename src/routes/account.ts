const Router = require("express-promise-router");
import account from "../db/account";
import { NextFunction, Request, Response } from "express";

import { authenticateAccount } from "../middleware/auth";

const router = new Router();

// router.use(authenticateAccount);

module.exports = router;

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id", id);
  const userProfile = await account.getAccountByFirebaseId(id);

  console.log("userProfile", userProfile);

  res.status(200).send(userProfile).status;
});

router.post("/new", async (req: Request, res: Response) => {
  console.log("req.body", req.body);
  const { name, email, firebaseId } = req.body;
  try {
    await account.postAccount({ name, email, firebaseId });
    res.send(200);
  } catch (e) {
    res.send(500);
  }
});
