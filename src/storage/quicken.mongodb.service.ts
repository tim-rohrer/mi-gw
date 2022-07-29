import * as MongoDB from "mongodb"

import { quickenCollection } from "./mongodb-storage-service.js"
import { QuickenImportModel } from "./storage.types.js"

export const addImport = async (resource: QuickenImportModel) =>
  quickenCollection.insertOne(resource)

export const getAllImports = async () =>
  await quickenCollection.find({}).toArray()

export const removeImportById = async (id: MongoDB.ObjectId) =>
  await quickenCollection.deleteOne({ _id: id })

export const removeImportByTimestamp = async (timestamp: Date) =>
  await quickenCollection.deleteOne({ createdTimestamp: timestamp })

export const removeImportsOlderThanNewest = async (desiredQty: number) => {
  const idsToDelete: MongoDB.ObjectId[] = (
    await getIdsOfImportsOlderThanNewest(desiredQty)
  ).map((doc) => doc._id)
  return await removeImportsByIdsInList(idsToDelete)
}

export const removeImportsByIdsInList = async (
  idsToDelete: MongoDB.ObjectId[],
) => await quickenCollection.deleteMany({ _id: { $in: idsToDelete } })

const getIdsOfImportsOlderThanNewest = async (number: number) =>
  loadDocumentsUsingAggregationPipeline([
    {
      $sort: {
        createdTimestamp: -1,
      },
    },
    {
      $skip: number,
    },
    {
      $project: {
        _id: 1,
      },
    },
  ])

const loadDocumentsUsingAggregationPipeline = (pipeline: MongoDB.Document[]) =>
  performAggregationUsingPipeline(pipeline).toArray()

const performAggregationUsingPipeline = (pipeline: MongoDB.Document[]) =>
  quickenCollection.aggregate(pipeline)

export const loadMostRecentImport = () =>
  loadDocumentsUsingAggregationPipeline([
    {
      $sort: {
        createdTimestamp: -1,
      },
    },
    {
      $limit: 1,
    },
  ])
