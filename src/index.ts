require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

import express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
const mountRoutes = require("./routes");

const app = express();
mountRoutes(app);
const port = 3001;

// console.log(process.env.PGPASSWORD);
// console.log(process.env.NODE_ENV);

// app.get("/", (_, res) => {
//   res.status(200).send("Ok!!");
// });

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
// app.use("/v1.0", require("./routes/index")(app));

app.listen(port, () => console.log(`Running on port ${port}`));
