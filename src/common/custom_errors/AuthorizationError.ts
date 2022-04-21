import BaseError from "./BaseError.js"
import { HttpStatusCode } from "./http-status-codes.js"

export default class AuthorizationError extends BaseError {
  httpCode = HttpStatusCode.FORBIDDEN

  constructor(detail?: string) {
    super(detail)
  }
}
