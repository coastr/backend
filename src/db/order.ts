import db from "./index";

const createNewOrder = async ({ restaurantId, accountId }) => {
  console.log("restaurantId, accountId", restaurantId, accountId);
  const { rows } = await db.query(`
        INSERT INTO dev.order (restaurant_id, account_id, tip, status)
        VALUES ('${restaurantId}', '${accountId}', 0, 'active')
        RETURNING id
    `);

  console.log("apparent orderId", rows[0].id);
  return rows[0].id;
};

const addItemToOrder = async ({
  orderId,
  menuItemId,
  quantity,
  optionValues,
}) => {
  const { rows } = await db.query(`
    INSERT INTO dev.order_item (order_id, menu_item_id, item_number, price)
    VALUES ('${orderId}', '${menuItemId}', ${quantity}, 0)
    RETURNING id
    `);

  const orderItemId = rows[0].id;
  console.log("orderItemId", orderItemId);

  Object.keys(optionValues).map(async (optionId) => {
    console.log("optionId", optionId);
    console.log("optionValues[optionId]", optionValues[optionId]);
    await db.query(`
      INSERT INTO dev.order_item_option (order_item_id, menu_item_option_id, value)
      VALUES ('${orderItemId}', '${optionId}', ${optionValues[optionId].value})
      `);
  });
};

const updateOrderItemPrice = async (orderItemId: string) => {
  const { rows } = await db.query(`
    SELECT menu_item.price, menu_item_option.price_delta FROM order_item_option 
      JOIN dev.order_item ON dev.order_item.id=order_item_option.order_item_id
      JOIN menu_item ON menu_item.id=order_item.menu_item_id
      JOIN menu_item_option ON menu_item_option.id=order_item_option.menu_item_option_id
    WHERE order_item_id='${orderItemId}';
  `);

  let price = rows[0].price;
  for (const menuItemOption of rows) {
    price += menuItemOption.price_delta;
  }
  await db.query(`
    UPDATE order_item_option
    SET price=${price}
    WHERE id='${orderItemId}'
  `);
};

const getActiveOrderByAccountIdAndRestaurantId = async (
  accountId: string,
  restaurantId: string
) => {
  const { rows } = await db.query(`
  SELECT menu_item.name AS item_name, menu_item_option.name AS option_name, value, menu_item_option.price_delta, tip, dev.order.account_id, order_item.item_number,
         order_item_option.id AS order_item_option_id, dev.order.id AS order_id, order_item.id AS order_item_id
  FROM order_item_option
    INNER JOIN menu_item_option ON menu_item_option.id = order_item_option.menu_item_option_id
    INNER JOIN order_item ON order_item_option.order_item_id = order_item.id
    INNER JOIN menu_item ON order_item.menu_item_id = menu_item.id
    INNER JOIN dev.order ON order_item.order_id = dev.order.id
  WHERE (dev.order.account_id = '${accountId}' AND dev.order.restaurant_id = '${restaurantId}' AND dev.order.status='active');
`);
  return rows;
};

const getOrderById = async (id: string) => {
  const { rows } = await db.query(`
  SELECT menu_item.name AS item_name, menu_item_option.name AS option_name, value, menu_item_option.price_delta, tip, dev.order.account_id, order_item.item_number,
         menu_item_option.id AS menu_item_option_id
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
  getActiveOrderByAccountIdAndRestaurantId,
  getOrderById,
  updateOrderItemPrice,
};
