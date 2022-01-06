// import axios from "axios";
import { Client, Environment } from "square";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const catalogApi = client.catalogApi;
const ordersApi = client.ordersApi;

export { catalogApi, ordersApi };
