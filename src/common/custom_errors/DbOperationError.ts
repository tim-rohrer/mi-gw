import { HttpStatusCode } from "../http-status-codes"
import BaseError from "./BaseError"

export default class DbOperationError extends BaseError {
  httpCode = HttpStatusCode.INTERNAL_SERVER

  constructor(detail?: string) {
    super(detail)
  }
}
