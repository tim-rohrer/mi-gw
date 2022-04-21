import { ProblemDocument } from "http-problem-details"
import { ErrorMapper } from "http-problem-details-mapper"

import APITokenFormatError from "../custom_errors/APITokenFormatError.js"

export default class APITokenFormatErrorMapper extends ErrorMapper {
  constructor() {
    super(APITokenFormatError)
  }

  mapError(error: APITokenFormatError) {
    return new ProblemDocument({
      status: error.httpCode,
      type: "/errors/api-token-format-error",
      title: "Malformed or missing API Token",
      detail: error.message,
    })
  }
}
