import { HttpStatusCode } from "../http-status-codes.js"
import BaseError from "./BaseError.js"

export default abstract class ValidationError extends BaseError {
  httpCode = HttpStatusCode.BAD_REQUEST

  constructor() {
    super()
  }
}
