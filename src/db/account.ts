import db from "./index";

const getAccountByFirebaseId = async (id: string) => {
  const { rows } = await db.query(
    `SELECT name, email, phone FROM account WHERE firebase_id='${id}'`
  );
  return rows[0];
};

const getAccountIdByFirebaseId = async (id: string) => {
  const { rows } = await db.query(
    `SELECT id FROM account WHERE firebase_id='${id}'`
  );
  return rows[0];
};

const postAccount = async ({ name, email, firebaseId }) => {
  try {
    await db.query(
      `INSERT INTO account (name, email, firebase_id)
       VALUES ('${name}', '${email}', '${firebaseId}')`
    );
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export default {
  getAccountByFirebaseId,
  getAccountIdByFirebaseId,
  postAccount,
};
