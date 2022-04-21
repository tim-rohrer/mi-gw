import { ProblemDocument } from "http-problem-details"
import { ErrorMapper } from "http-problem-details-mapper"

import NotFoundError from "../custom_errors/NotFoundError.js"
import { HttpStatusCode } from "../http-status-codes.js"

export default class NotFoundErrorMapper extends ErrorMapper {
  constructor() {
    super(NotFoundError)
  }

  mapError(error: Error) {
    return new ProblemDocument({
      status: HttpStatusCode.NOT_FOUND,
      title: "The server cannot find the requested resource.",
      type: "http://tempuri.org/NotFoundError",
      detail: error.message,
    })
  }
}
