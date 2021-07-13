const { Pool } = require("pg");
const pool = new Pool();

export default {
  query: (text: any, params?: any, callback?: any) => {
    return pool.query(text, params, callback);
  },
  getClient: (callback: any) => {
    pool.connect((err: any, client: any, done: any) => {
      callback(err, client, done);
    });
  },
};
