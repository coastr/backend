import db from "./index";

const createNewOrder = async ({ restaurantId, accountId }) => {
  const orderId = await db.query(`
        INSERT INTO dev.order (restaurant_id, account_id, tip)
        VALUES ('${restaurantId}', '${accountId}', 0)
        RETURNING id
    `);

  console.log("apparent orderId", orderId);
  return orderId;
};

const addItemToOrder = async ({
  orderId,
  menuItemId,
  numberOfItems,
  price,
  optionValues,
}) => {
  const orderItemId = await db.query(`
    INSERT INTO dev.order_item (order_id, menu_item_id, item_number, price)
    VALUES ('${orderId}', '${menuItemId}', ${numberOfItems}, ${price})
    RETURNING id
    `);

  Object.keys(optionValues).map(async (optionId) => {
    await db.query(`
      INSERT INTO dev.order_item_option (order_item_id, menu_item_option_id, value)
      VALUES ('${orderItemId}', '${optionId}', ${optionValues[optionId]})
      `);
  });
};

export default {
  createNewOrder,
  addItemToOrder,
};
