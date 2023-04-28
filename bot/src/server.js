/* IMPORTS */

import { config } from "dotenv";
config();

import { eventListener, botSetup } from "./controllers/webex.js";

import mongoClient from "./utils/db.js";

/* FUNCTIONS */

mongoClient.connect((err) => {
  if (!err) {
    console.log("mongo connection established.");
    botSetup();
    eventListener();
  } else {
    console.error("Error while trying to connect to MongoDB");
  }
});
