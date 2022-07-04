import * as MongoDB from "mongodb"
import { Err, Ok } from "ts-results-es"

import DbOperationError from "../../common/custom_errors/DbOperationError"
import Logger from "../../common/logger"
import { QuickenParsedResultDTO } from "../../quicken/quicken.types.js"
import { DAOActionResult, DatabaseDAO, QuickenDAO } from "../storage.types.js"

export default class MongoQuickenDAO implements QuickenDAO, DatabaseDAO {
  quicken: MongoDB.Collection<QuickenParsedResultDTO>

  injectDB(conn: MongoDB.MongoClient): void {
    if (this.quicken) return
    try {
      this.quicken = conn.db("test").collection("quicken")
    } catch (error) {
      console.error(
        `Unable to establish collection handles in MongoDB Quicken Import DAO: ${error}`,
      )
      throw error
    }
  }

  public async addImport(
    importFields: QuickenParsedResultDTO,
  ): DAOActionResult<Date, DbOperationError> {
    try {
      await this.quicken.insertOne(importFields, {
        writeConcern: { w: "majority" },
      })
      return Ok(importFields.createdTimestamp)
    } catch (error) {
      if (String(error).includes("E11000 duplicate key error")) {
        return Err(
          new DbOperationError(
            "This information cannot be duplicated in the database.",
          ),
        )
      }
      return Err(
        new DbOperationError(
          "Unknown error attempting to create database record.",
        ),
      )
    }
  }

  public async getImport(
    date: Date,
  ): DAOActionResult<QuickenParsedResultDTO | null, DbOperationError> {
    try {
      Logger.debug(`Searching db for ${date}`)
      const quickenData = await this.quicken.findOne(
        {
          createdTimestamp: date,
        },
        {
          projection: { _id: 0 },
        },
      )
      Logger.debug(
        `The value returned from the db: ${JSON.stringify(quickenData)}`,
      )
      /** Move next block to service layer */
      // if (quickenData === null || quickenData === undefined) {
      //   Logger.debug(
      //     `MongoQuickenDAO.getUserById ${date} not found in db.`,
      //   )
      //   return Err(new NotFoundError({ type: "Quicken Import", id: date }))
      // }
      return Ok(quickenData)
    } catch (error) {
      Logger.error(error)
      return Err(
        new DbOperationError(
          `Unknown error attempting to retrieve database record for ${date}`,
        ),
      )
    }
  }

  public async removeImport(
    date: Date,
  ): DAOActionResult<boolean, DbOperationError> {
    try {
      Logger.debug(`MongoQuickenDAO.quicken.deleteOne with ${date}`)
      const removalResult = await this.quicken.deleteOne({
        createdTimestamp: date,
      })
      Logger.debug(`deleteOne results ${JSON.stringify(removalResult)}`)
      return Ok(removalResult.deletedCount === 0 ? false : true)
    } catch (error) {
      let errorMessage = "Unknown error"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return Err(
        new DbOperationError(
          `Problem with database operation: ${errorMessage}`,
        ),
      )
    }
  }
}
