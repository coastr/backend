import db from "./index";

const getRestaurantById = async (id: string) => {
  const { rows } = await db.query(`
    SELECT name FROM restaurant WHERE id='${id}'`);
  return rows[0];
};

const getMenuByRestaurantId = async (id: string) => {
  const { rows } = await db.query(`
  SELECT 
    menu_category.name AS category_name,
    menu_category.id AS menu_category_id,
    menu_item.name AS menu_item_name, 
    menu_item.id AS menu_item_id,
    menu_item.description,
    menu_item.price, 
    menu_item.position
  FROM menu_item
  INNER JOIN menu_category ON menu_item.menu_category_id = menu_category.id
  WHERE menu_category.restaurant_id = '${id}'
  `);

  const data = {};
  for (const menuItem of rows) {
    const itemObj = {
      menuItemName: menuItem.menu_item_name,
      menuItemId: menuItem.menu_item_id,
      position: menuItem.position,
      menuItemPrice: menuItem.price,
      description: menuItem.description,
    };

    if (data[menuItem.menu_category_id]) {
      data[menuItem.menu_category_id].items.push(itemObj);
    } else {
      data[menuItem.menu_category_id] = {
        name: menuItem.category_name,
        menuCategoryId: menuItem.menu_category_id,
        items: [itemObj],
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
