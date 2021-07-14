const { Pool, types } = require("pg");
const pool = new Pool();

// const types = require("pg").types;

types.setTypeParser(1700, (val) => {
  return parseFloat(val);
});

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
