import * as MongoDB from "mongodb"

import { DAOFactory, QuickenDAO } from "../storage.types.js"
import MongoQuickenDAO from "./MongoQuickenDAO.js"

export default class MongoDAOFactory implements DAOFactory {
  async createQuickenDAO(): Promise<QuickenDAO> {
    let connection: MongoDB.MongoClient
    try {
      const uri = process.env.MONGO_URI
      if (uri === undefined) throw new Error("Test failed to setup")
      connection = await MongoDB.MongoClient.connect(uri)
    } catch (error) {
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      throw new Error(errorMessage)
    }
    const mongoQuickenDAO = new MongoQuickenDAO()
    mongoQuickenDAO.injectDB(connection)
    return mongoQuickenDAO
  }
}

// public static DRIVER = MongoDB.MongoClient
// public static URI = process.env.MONGO_URI

// protected async createConnection(): Promise<MongoDB.MongoClient> {

// }

// public async createQuickenDAO(): DAOActionResult<boolean, Error> {
//   try {
//     MongoQuickenDAO.injectDB(await this.createConnection())
//     return Ok(true)
//   } catch (error) {
//     let errorMessage = "Unknown error"
//     if (error instanceof Error) {
//       errorMessage = error.message
//     }
//     return Err(new Error(errorMessage))
//   }
// }
