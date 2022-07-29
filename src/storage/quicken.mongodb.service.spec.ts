import * as MongoDB from "mongodb"

import { jest } from "@jest/globals"

import { mongoClient, quickenCollection } from "./mongodb-storage-service.js"
import * as quickenStorage from "./quicken.mongodb.service.js"
import { QuickenImportModel } from "./storage.types.js"

let db: MongoDB.Db

async function addSpecifiedNumberOfImports(desiredQty: number) {
  const timestamps = createTimestamps(desiredQty)
  const imports = timestamps.map((timestamp) => {
    return {
      createdTimestamp: timestamp,
      data: ["string1", "string2", "string3"],
    }
  })
  const { insertedIds } = await db.collection("quicken").insertMany(imports)
  return {
    ids: insertedIds,
    createdTimestamps: timestamps,
  }
}

const createTimestamps = (numberDesired: number) =>
  Array(numberDesired)
    .fill(0)
    .map(() => randomDate(new Date(2022, 0o6, 0o1), new Date()))

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}

async function deleteDatabaseData() {
  await quickenCollection.deleteMany({})
}

beforeAll(async () => {
  db = mongoClient.db("test")
})
afterAll(async () => {
  await mongoClient.close()
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

  const result = await quickenStorage.addImport(resource)

  expect(result.acknowledged).toBe(true)
  expect(result.insertedId).toBeDefined()
})

test("getAllImports should list all stored Quicken Imports", async () => {
  await addSpecifiedNumberOfImports(3)

  const result = await quickenStorage.getAllImports()

  expect(result).toHaveLength(3)
})

test("removeImportById should succeed", async () => {
  const addResult = await addSpecifiedNumberOfImports(3)
  const { ids } = addResult

  const { acknowledged, deletedCount } = await quickenStorage.removeImportById(
    ids["0"],
  )

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(1)
})

test("removeImportByTimestamp should succeed", async () => {
  const { createdTimestamps } = await addSpecifiedNumberOfImports(3)

  const { acknowledged, deletedCount } =
    await quickenStorage.removeImportByTimestamp(createdTimestamps[0])

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(1)
})

test("removeImportsByIdsInList should succeed", async () => {
  const { ids } = await addSpecifiedNumberOfImports(3)

  const { acknowledged, deletedCount } =
    await quickenStorage.removeImportsByIdsInList(Object.values(ids))

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(3)
})

test("removeImportsOlderThanNewest should succeed, leaving five imports", async () => {
  await addSpecifiedNumberOfImports(20)
  const coll = db.collection<QuickenImportModel>("quicken")

  const { acknowledged, deletedCount } =
    await quickenStorage.removeImportsOlderThanNewest(5)

  expect(acknowledged).toBe(true)
  expect(deletedCount).toBe(15)
  expect(await coll.find({}).toArray()).toHaveLength(5)
})

test("loadMostRecentQuickenImport should return the right document", async () => {
  const { createdTimestamps } = await addSpecifiedNumberOfImports(3)
  const sortedTimestamps = createdTimestamps
    .sort((date1, date2) => date1.getTime() - date2.getTime())
    .reverse()
  const testResult = await db
    .collection<QuickenImportModel>("quicken")
    .findOne({ createdTimestamp: sortedTimestamps[0] })

  const result = await quickenStorage.loadMostRecentImport()

  expect(result[0]).toEqual(testResult)
})
