import db from "./index";

const createNewOrder = async ({ restaurantId, accountId }) => {
  console.log("restaurantId, accountId", restaurantId, accountId);
  const { rows } = await db.query(`
        INSERT INTO dev.order (restaurant_id, account_id, tip)
        VALUES ('${restaurantId}', '${accountId}', 0)
        RETURNING id
    `);

  console.log("apparent orderId", rows[0].id);
  return rows[0].id;
};

const addItemToOrder = async ({
  orderId,
  menuItemId,
  numberOfItems,
  price,
  optionValues,
}) => {
  const { rows } = await db.query(`
    INSERT INTO dev.order_item (order_id, menu_item_id, item_number, price)
    VALUES ('${orderId}', '${menuItemId}', ${numberOfItems}, ${price})
    RETURNING id
    `);

  const orderItemId = rows[0].id;
  console.log("orderItemId", orderItemId);

  Object.keys(optionValues).map(async (optionId) => {
    console.log("optionId", optionId);
    await db.query(`
      INSERT INTO dev.order_item_option (order_item_id, menu_item_option_id, value)
      VALUES ('${orderItemId}', '${optionId}', ${optionValues[optionId]})
      `);
  });
};

const getOrderById = async (id: string) => {
  const { rows } = await db.query(`
  SELECT menu_item.name AS item_name, menu_item_option.name AS option_name, value, menu_item_option.price_delta, tip, dev.order.account_id, order_item.item_number
  FROM order_item_option
    INNER JOIN menu_item_option ON menu_item_option.id = order_item_option.menu_item_option_id
    INNER JOIN order_item ON order_item_option.order_item_id = order_item.id
    INNER JOIN menu_item ON order_item.menu_item_id = menu_item.id
    INNER JOIN dev.order ON order_item.order_id = dev.order.id
  WHERE order_item.order_id = '${id}';
`);
  return rows;
};

export default {
  createNewOrder,
  addItemToOrder,
  getOrderById,
};
