import db from "./index";

const createNewOrder = async ({ restaurantId, accountId }) => {
  console.log("restaurantId, accountId", restaurantId, accountId);
  const { rows } = await db.query(`
        INSERT INTO dev.order (restaurant_id, account_id, tip, status)
        VALUES ('${restaurantId}', '${accountId}', 0, 'active')
        RETURNING id
    `);
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

  Object.keys(optionValues).map(async (optionId) => {
    await db.query(`
      INSERT INTO dev.order_item_option (order_item_id, menu_item_option_id, value)
      VALUES ('${orderItemId}', '${optionId}', ${optionValues[optionId].value})
    `);
  });
  return orderItemId;
};

const updateItemInOrder = async ({ orderItemId, quantity, optionValues }) => {
  await db.query(`
    UPDATE dev.order_item
      SET item_number=${quantity}
    WHERE id='${orderItemId}'
  `);

  await db.query(`
    DELETE FROM dev.order_item_option
    WHERE order_item_id='${orderItemId}'
  `);

  Object.keys(optionValues).map(async (optionId) => {
    await db.query(`
      INSERT INTO dev.order_item_option (order_item_id, menu_item_option_id, value)
      VALUES ('${orderItemId}', '${optionId}', ${optionValues[optionId].value})
    `);
  });
};

const deleteItemById = async (id: string) => {
  await db.query(`
    DELETE FROM order_item WHERE id='${id}';
  `);
};

const updateOrderItemPrice = async (orderItemId: string) => {
  console.log("orderItemId", orderItemId);
  const { rows } = await db.query(`
    SELECT 
      menu_item.price,
      menu_item_option.price_delta,
      order_item.item_number AS item_quantity,
	    order_item_option.value AS item_option_quantity
    FROM order_item_option
      JOIN dev.order_item ON dev.order_item.id=order_item_option.order_item_id
      JOIN menu_item ON menu_item.id=order_item.menu_item_id
      JOIN menu_item_option ON menu_item_option.id=order_item_option.menu_item_option_id
    WHERE order_item_id='${orderItemId}';
  `);

  console.log("rows", rows);

  let price = rows[0].price;
  for (const row of rows) {
    price += row.price_delta * row.item_option_quantity;
  }

  price *= rows[0].item_quantity;

  console.log("price", price);

  await db.query(`
    UPDATE order_item
      SET price=${price}
    WHERE id='${orderItemId}'
  `);
};

const getActiveOrderByAccountIdAndRestaurantId = async (
  accountId: string,
  restaurantId: string
) => {
  const { rows } = await db.query(`
  SELECT 
    menu_item.id AS menu_item_id,
    menu_item.name AS menu_item_name,
    menu_item_option.name AS option_name, 
    menu_item_option.price_delta,
    menu_item.price AS menu_item_price,
    menu_item_option.id AS menu_item_option_id,
    menu_item.description AS menu_item_description,
    value, 
    tip, 
    dev.order.account_id,
    dev.order.id AS order_id, 
    order_item.item_number,
    order_item_option.id AS order_item_option_id, 
    order_item.id AS order_item_id, 
    order_item.price AS order_item_price
  FROM order_item_option
    INNER JOIN menu_item_option ON menu_item_option.id = order_item_option.menu_item_option_id
    INNER JOIN order_item ON order_item_option.order_item_id = order_item.id
    INNER JOIN menu_item ON order_item.menu_item_id = menu_item.id
    INNER JOIN dev.order ON order_item.order_id = dev.order.id
  WHERE (dev.order.account_id = '${accountId}' AND dev.order.restaurant_id = '${restaurantId}' AND dev.order.status='active')
  ORDER BY order_item.created_at, menu_item_option.position ASC;
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
  updateItemInOrder,
  deleteItemById,
};
