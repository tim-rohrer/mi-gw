import * as dotenv from "dotenv"
import * as MongoDB from "mongodb"

import { QuickenImportModel } from "./quicken.mongodb.service"

export function connectToDatabase() {
  try {
    dotenv.config()
    const uri = process.env.MONGO_URI
    const mongoClientOptions: MongoDB.MongoClientOptions = {
      maxPoolSize: 50,
      w: "majority",
      wtimeoutMS: 2500,
    }
    if (!uri) return new Error("Cannot start server")
    return MongoDB.MongoClient.connect(uri, mongoClientOptions)
      .then((client) => client)
      .catch((error) => {
        throw new Error(error)
      })
  } catch (error) {
    console.error(error)
  }
}

const uri = process.env.MONGO_URI
if (uri === undefined) throw new Error("Test failed to setup")
export const client = await MongoDB.MongoClient.connect(uri)
const db = client.db("test")

export const quickenCollection = db.collection<QuickenImportModel>("quicken")
