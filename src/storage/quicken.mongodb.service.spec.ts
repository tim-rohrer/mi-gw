import * as MongoDB from "mongodb"

import { jest } from "@jest/globals"

import {
  addImport,
  getAllImports,
  QuickenImportModel,
  removeImportById,
  removeImportByTimestamp,
  removeImportsByIdsInList,
  removeImportsOlderThanNewest,
} from "./quicken.mongodb.service.js"
import { client } from "./setupMongoDbServices"

let db: MongoDB.Db

async function setupTestDatabaseConnection() {
  try {
    db = client.db("test")
  } catch (error) {
    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    throw new Error(errorMessage)
  }
}

async function addSpecifiedNumberOfImports(desiredQty: number) {
  const collection = db.collection("quicken")
  const timestamps = createTimestamps(desiredQty)
  const imports = timestamps.map((timestamp) => {
    return {
      createdTimestamp: timestamp,
      data: ["string1", "string2", "string3"],
    }
  })
  const { insertedIds } = await collection.insertMany(imports)
  return {
    ids: insertedIds,
    createdTimestamps: timestamps,
  }
}

const createTimestamps = (numberDesired: number) =>
  Array(numberDesired)
    .fill(0)
    .map(() => dateFromThePast(new Date(), randomNumberOneToTen()))

function dateFromThePast(now: Date, daysToSubtract: number) {
  const MILLISECONDS_PER_DAY = 86400000
  return new Date(now.getTime() - daysToSubtract * MILLISECONDS_PER_DAY)
}

function randomNumberOneToTen() {
  return Math.floor(Math.random() * 10) + 1
}

async function deleteDatabaseData() {
  await db.collection("quicken").deleteMany({})
}

beforeAll(async () => {
  await setupTestDatabaseConnection()
})
afterAll(async () => {
  await client.close()
})
beforeEach(async () => {
  await deleteDatabaseData()
})
afterEach(async () => {
  jest.resetAllMocks()
})

test("addImport handles successful import case", async () => {
  const resource: QuickenImportModel = {
    createdTimestamp: new Date(),
    data: ["data1", "data2"],
  }

  const result = await addImport(resource)

  expect(result.acknowledged).toBe(true)
  expect(result.insertedId).toBeDefined()
})

test("getAllImports should list all stored Quicken Imports", async () => {
  await addSpecifiedNumberOfImports(3)

  const result = await getAllImports()

  expect(result).toHaveLength(3)
})

test("removeImportById should succeed", async () => {
  const addResult = await addSpecifiedNumberOfImports(3)
  const { ids } = addResult

  const { acknowledged, deletedCount } = await removeImportById(ids["0"])

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(1)
})

test("removeImportByTimestamp should succeed", async () => {
  const { createdTimestamps } = await addSpecifiedNumberOfImports(3)

  const { acknowledged, deletedCount } = await removeImportByTimestamp(
    createdTimestamps[0],
  )

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(1)
})

test("removeImportsByIdsInList should succeed", async () => {
  const { ids } = await addSpecifiedNumberOfImports(3)

  const { acknowledged, deletedCount } = await removeImportsByIdsInList(
    Object.values(ids),
  )

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(3)
})

test("removeImportsOlderThanNewest should succeed, leaving five imports", async () => {
  await addSpecifiedNumberOfImports(20)
  const coll = db.collection<QuickenImportModel>("quicken")

  const { acknowledged, deletedCount } = await removeImportsOlderThanNewest(5)

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(15)
  expect(await coll.find({}).toArray()).toHaveLength(5)
})
