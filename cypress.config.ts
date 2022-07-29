import { defineConfig } from "cypress"
import { MongoClient } from "mongodb"

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // setupNodeEvents(on, config) {
    // return require('./cypress/plugins/index.cjs')(on, config)
    // },
    setupNodeEvents(on) {
      // bind to the event we care about
      on("task", {
        async "reset:database"(args) {
          try {
            const { url } = args
            const connection = await MongoClient.connect(url)
            await connection.db("test").collection("quicken").deleteMany({})
            await connection.close()
            return null
          } catch (error) {
            console.error(error)
            return error
          }
        },
        async "seedImports:database"(args) {
          const { url, actionData } = args
          const { desiredNumberOfImportRecords } = actionData
          try {
            const importRecords = createSpecifiedNumberOfImports(
              desiredNumberOfImportRecords,
            )
            const connection = await MongoClient.connect(url)
            await connection
              .db("test")
              .collection("quicken")
              .insertMany(importRecords)
            await connection.close()
            return mostRecentTimestampOf(importRecords)
          } catch (error) {
            console.error(error)
            return error
          }
        },
      })
    },
    baseUrl: "http://localhost:5000/api/v1",
  },
})

const createSpecifiedNumberOfImports = (desiredQty: number) => {
  const timestamps = createTimestamps(desiredQty)
  return timestamps.map((timestamp) => {
    return {
      createdTimestamp: timestamp,
      data: ["string1", "string2", "string3"],
    }
  })
}

const createTimestamps = (numberDesired: number) =>
  Array(numberDesired)
    .fill(0)
    .map(() => randomDate(new Date(2022, 0o6, 0o1), new Date()))

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

const mostRecentTimestampOf = (records) =>
  records
    .map((record: { createdTimestamp: Date }) => record.createdTimestamp)
    .sort((date1: Date, date2: Date) => date1.getTime() - date2.getTime())
    .reverse()[0]
