import { Result } from "ts-results-es"

import DbOperationError from "../common/custom_errors/DbOperationError.js"
import { QuickenParsedResultDTO } from "../quicken/quicken.types.js"

export type DAOActionResult<Success, Fail> = Promise<Result<Success, Fail>>

type Quicken = QuickenParsedResultDTO

export interface DAOFactory {
  createQuickenDAO(): QuickenDAO | Promise<QuickenDAO>
  // createPortfolioDAO: () => PortfolioDAO
}

export interface DatabaseDAO {
  injectDB(arg0: unknown): void
}

export interface QuickenDAO {
  addImport(arg0: Quicken): DAOActionResult<Date, DbOperationError>
  removeImport(arg0: Date): DAOActionResult<boolean, DbOperationError>
  getImport(arg0: Date): DAOActionResult<Quicken | null, DbOperationError>
}
