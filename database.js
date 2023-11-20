import "dotenv/config";
import { MongoDatabase } from "./data/mongo_database.js";
import { DataManager } from "./data/data_manager.js";

let dataManager;

//Connect to the database
export async function connectDB(){
    let database = new MongoDatabase();
    dataManager = new DataManager(database);
    return await dataManager.initDb(process.env.MONGO_URL);
}

//Gets the database
export function getDB(){
    return dataManager;
}

export async function disconnectDB(){
    return await dataManager.disconnectDB();
}