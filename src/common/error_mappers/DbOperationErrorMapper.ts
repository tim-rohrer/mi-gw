import { ProblemDocument } from "http-problem-details"
import { ErrorMapper } from "http-problem-details-mapper"

import DbOperationError from "../custom_errors/DbOperationError"

export default class DbOperationErrorMapper extends ErrorMapper {
  constructor() {
    super(DbOperationError)
  }

  mapError(error: DbOperationError) {
    return new ProblemDocument({
      status: error.httpCode,
      detail: error.message,
    })
  }
}
