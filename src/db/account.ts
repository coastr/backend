import db from "./index";

const getAccountByFirebaseId = async (id: string) => {
  const { rows } = await db.query(
    `SELECT * FROM account WHERE firebase_id =${id}`
  );
  return rows[0];
};

const postAccount = async ({ name, email, firebaseId }) => {
  await db.query(
    `INSERT INTO account (name, email, firebase_id)
     VALUES (${name}, ${email}, ${firebaseId})`
  );
};

export default {
  getAccountByFirebaseId,
  postAccount,
};
