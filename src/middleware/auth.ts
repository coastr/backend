import admin from "../firebase";
import { Request, Response, NextFunction } from "express";

const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
  let authToken;
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    authToken = req.headers.authorization.split(" ")[1];
  } else {
    authToken = null;
  }
  req.body = {
    ...req.body,
    authToken,
  };
  next();
};

export const authenticateAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req.body;
      const account = await admin.auth().verifyIdToken(authToken);
      req.body.firebaseId = account.uid;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send("You are not authorized to make this request");
    }
  });
};
