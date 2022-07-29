import express from "express"

import DbOperationError from "../../common/custom_errors/DbOperationError.js"
import Logger from "../../common/logger.js"
import { currentTimestamp } from "../../common/utils.js"
import {
  fetchQuickenInvestmentData,
  getMostRecentImport,
  storeQuickenImport,
} from "../services/quicken.service.js"

export const getData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { ok, val } = await fetchQuickenInvestmentData()
  if (ok) {
    Logger.info(`fetch result being returned ${JSON.stringify(val)}`)
    res.status(200).json(val)
  } else {
    Logger.error(`${JSON.stringify(val)}`)
    next(val)
  }
}

export const recordQuickenImport = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { acknowledged, insertedId } = await storeQuickenImport({
      createdTimestamp: currentTimestamp(),
      data: req.body.data,
    })
    if (acknowledged) {
      res.status(200).json(insertedId)
    } else
      throw new DbOperationError(
        "The database write was not acknowledged. Please investigate and try again.",
      )
  } catch (error) {
    next(error)
  }
}

export const provideMostRecentQuickenImport = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const result = await getMostRecentImport()
    if (result) {
      res.status(200).json(result)
    } else
      throw new DbOperationError(
        "The database read encountered a problem. Please investigate and try again.",
      )
  } catch (error) {
    next(error)
  }
}
