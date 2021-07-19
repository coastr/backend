import express from "express";
import { validate } from "uuid";
import account from "../db/account";
import { NextFunction, Request, Response } from "express";

import { authenticateAccount } from "../middleware/auth";
import order from "../db/order";

const router = express.Router();

router.use(authenticateAccount);

router.get(
  "/restaurant/:restaurantId/active",
  async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      const { firebaseId } = req.body;

      const { id: accountId } = await account.getAccountIdByFirebaseId(
        firebaseId
      );

      const rawOrder = await order.getActiveOrderByAccountIdAndRestaurantId(
        accountId,
        restaurantId
      );
      const nestedOrder = {};

      if (!rawOrder.length) {
        res.status(204).send({});
        return;
      }

      for (const orderOption of rawOrder) {
        if (nestedOrder[orderOption.order_item_id]) {
          nestedOrder[orderOption.order_item_id].options.push({
            optionName: orderOption.option_name,
            value: orderOption.value,
            priceDelta: orderOption.price_delta,
            orderOptionId: orderOption.order_item_option_id,
          });
        } else {
          nestedOrder[orderOption.order_item_id] = {
            itemName: orderOption.item_name,
            numberOfItems: orderOption.item_number,
            options: [
              {
                optionName: orderOption.option_name,
                value: orderOption.value,
                priceDelta: orderOption.price_delta,
                orderOptionId: orderOption.order_item_option_id,
              },
            ],
          };
        }
      }

      const formattedOrder = Object.values(nestedOrder);
      // return formattedOrder;

      const topOrder = {
        tip: rawOrder[0].tip,
        items: formattedOrder,
        orderId: rawOrder[0].order_id,
      };
      res.status(200).send(topOrder);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firebaseId } = req.body;

    if (!validate(id)) {
      res.sendStatus(400);
    }

    const { id: accountId } = await account.getAccountIdByFirebaseId(
      firebaseId
    );

    const rawOrder = await order.getOrderById(id);

    const nestedOrder = {};

    for (const orderOption of rawOrder) {
      if (nestedOrder[orderOption.item_name]) {
        nestedOrder[orderOption.item_name].options.push({
          optionName: orderOption.option_name,
          value: orderOption.value,
          priceDelta: orderOption.priceDelta,
        });
      } else {
        nestedOrder[orderOption.item_name] = {
          itemName: orderOption.item_name,
          numberOfItems: orderOption.item_number,
          options: [
            {
              optionName: orderOption.option_name,
              value: orderOption.value,
              priceDelta: orderOption.priceDelta,
            },
          ],
        };
      }
    }

    const formattedOrder = Object.values(nestedOrder);
    // return formattedOrder;

    const topOrder = {
      orderId: id,
      tip: rawOrder[0].tip,
      items: formattedOrder,
    };
    res.status(200).send(topOrder);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post("/:id/item", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let orderId = id;
    const { restaurantId, firebaseId, menuItemId, quantity, optionValues } =
      req.body;

    if (
      !restaurantId ||
      !firebaseId ||
      !menuItemId ||
      !quantity ||
      !optionValues
    ) {
      res.sendStatus(400);
      return;
    }
    const { id: accountId } = await account.getAccountIdByFirebaseId(
      firebaseId
    );
    if (!accountId) res.sendStatus(500);

    if (!validate(orderId)) {
      orderId = await order.createNewOrder({ restaurantId, accountId });
    }

    await order.addItemToOrder({
      orderId,
      menuItemId,
      quantity,
      optionValues,
    });

    await order.updateOrderItemPrice(orderId);

    res.status(201).send(orderId);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
