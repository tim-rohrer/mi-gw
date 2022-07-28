import QuickenInvestmentParser from "quicken-investment-parser"
import { Err, Ok } from "ts-results-es"

import Logger from "../../common/logger.js"
import * as quickenStore from "../../storage/quicken.mongodb.service.js"
import { QuickenImportModel } from "../../storage/storage.types.js"

export const fetchQuickenInvestmentData = async () => {
  const qp = new QuickenInvestmentParser("export.csv")
  const { ok, val } = await qp.parsedData()
  Logger.debug(
    `QuickenService.fetchQuickenInvestmentData result: ${JSON.stringify(
      ok,
    )} ${JSON.stringify(val)}`,
  )
  if (ok) return Ok(val)
  return Err(val)
}

export const storeQuickenImport = async (importRecord: QuickenImportModel) =>
  await quickenStore.addImport(importRecord)
