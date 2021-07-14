import db from "./index";

const getRestaurantById = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM restaurant WHERE id='${id}'`);
  return rows;
};

const getMenuByRestaurantId = async (id: string) => {
  const { rows } = await db.query(`
  SELECT menu_category.name AS category_name, menu_item.name AS item_name, menu_item.id AS item_id,
         menu_item.description, menu_item.price, menu_item.position
  FROM menu_item
  INNER JOIN menu_category ON menu_item.menu_category_id = menu_category.id
  WHERE menu_category.restaurant_id = '${id}'
  `);

  const data = {};
  for (let i: number = 0; i < rows.length; i++) {
    if (data[rows[i].category_name]) {
      data[rows[i].category_name].items.push(rows[i]);
    } else {
      data[rows[i].category_name] = {
        name: rows[i].category_name,
        items: [rows[i]],
      };
    }
  }

  console.log("data", data);

  const menu = Object.values(data);
  return menu;
};

export default {
  getRestaurantById,
  getMenuByRestaurantId,
};
