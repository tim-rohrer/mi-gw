import { ProblemDocument } from "http-problem-details"
import { ErrorMapper } from "http-problem-details-mapper"

import AuthorizationError from "../custom_errors/AuthorizationError.js"

export default class AuthorizationErrorMapper extends ErrorMapper {
  constructor() {
    super(AuthorizationError)
  }

  mapError(error: AuthorizationError) {
    return new ProblemDocument({
      status: error.httpCode,
      detail: error.message,
    })
  }
}
