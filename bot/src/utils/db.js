/* IMPORTS */

import { config } from "dotenv";
config();
import { MongoClient } from "mongodb";

/* RUNTIME VARS */
const mongoUri = `${process.env.MONGO_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);
const mongoDB = process.env.MONGO_DB;
const typeCol = "scenario";
const collectionType = "details";

/* EXPORTS */

export default mongoClient;

export { mongoDB, typeCol, collectionType };
