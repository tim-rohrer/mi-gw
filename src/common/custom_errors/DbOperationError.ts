import { HttpStatusCode } from "../http-status-codes.js"
import BaseError from "./BaseError.js"

export default class DbOperationError extends BaseError {
  httpCode = HttpStatusCode.INTERNAL_SERVER

  constructor(detail?: string) {
    super(detail)
  }
}
