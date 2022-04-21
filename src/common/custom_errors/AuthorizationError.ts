import { HttpStatusCode } from "../http-status-codes.js"
import BaseError from "./BaseError.js"

export default class AuthorizationError extends BaseError {
  httpCode = HttpStatusCode.FORBIDDEN

  constructor(detail?: string) {
    super(detail)
  }
}
