import db from "./index";

const getRestaurantById = async (id: string) => {
  const { rows } = await db.query(`SELECT * FROM restaurant WHERE id='${id}'`);
  return rows;
};

const getMenuByRestaurantId = async (id: string) => {
  const { rows } = await db.query(`
  SELECT menu_category.name AS category_name, menu_item.name AS item_name, menu_item.description, menu_item.price, menu_item.position
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
// [{
//   name: "Hot Drinks",
//   items: [
//     {name: "mocha", price: 2.50},
//     {name: "latte", price: 2.50},
//   ]
// },
// {
//   name: "Cold Drinks",
//   items: [
//     {name: "mocha", "price"}
//   ]
// }]
// const getMenu = async (id: string) => {

//     try {
//         const rows = await db.query('SELECT * FROM ')
//     }
// };

export default {
  getRestaurantById,
  getMenuByRestaurantId,
};
