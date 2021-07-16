import express from "express";
import account from "../db/account";
import { NextFunction, Request, Response } from "express";

import { authenticateAccount } from "../middleware/auth";
import order from "../db/order";

const router = express.Router();

router.use(authenticateAccount);

router.post("/:id/item", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let orderId = id;
    const {
      restaurantId,
      firebaseId,
      price,
      menuItemId,
      numberOfItems,
      optionValues,
    } = req.body;

    if (
      !restaurantId ||
      !firebaseId ||
      !menuItemId ||
      !numberOfItems ||
      !price ||
      !optionValues
    ) {
      res.sendStatus(400);
    }
    const accountId = await account.getAccountIdByFirebaseId(firebaseId);
    if (!accountId) res.sendStatus(500);

    if (!orderId) {
      orderId = await order.createNewOrder(restaurantId, accountId);
    }

    await order.addItemToOrder(
      (orderId, menuItemId, numberOfItems, price, optionValues)
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  res.status(200).send(userProfile);
});

module.exports = router;
