import db from "./index";

const getItemOptionsByItemId = async (id: string) => {
  const { rows } = await db.query(`
    SELECT menu_item_option_category.name AS category_name, menu_item_option.name AS option_name, 
           menu_item_option.price_delta, menu_item_option.position, menu_item_option_category.selector_type, 
           menu_item_option_category.min_options, menu_item_option_category.max_options
    FROM menu_item_option
    INNER JOIN menu_item_option_category ON menu_item_option.menu_item_option_category_id = menu_item_option_category.id
    WHERE menu_item_option_category.menu_item_id = '${id}';
    `);

  const data = {};
  for (let i: number = 0; i < rows.length; i++) {
    if (data[rows[i].category_name]) {
      data[rows[i].category_name].options.push(rows[i]);
    } else {
      data[rows[i].category_name] = {
        name: rows[i].category_name,
        selectorType: rows[i].selector_type,
        minOptions: rows[i].min_options,
        maxOptions: rows[i].max_options,
        options: [rows[i]],
      };
    }
  }

  const options = Object.values(data);
  return options;
};

export default {
  getItemOptionsByItemId,
};
