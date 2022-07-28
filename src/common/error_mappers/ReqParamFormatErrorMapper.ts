import { ProblemDocument } from "http-problem-details"
import { ErrorMapper } from "http-problem-details-mapper"

import ReqParamFormatError from "../custom_errors/ReqParamFormatError.js"

export default class ReqParamFormatErrorMapper extends ErrorMapper {
  constructor() {
    super(ReqParamFormatError)
  }

  mapError(error: ReqParamFormatError) {
    return new ProblemDocument({
      status: error.httpCode,
      type: "/errors/req-param-format-error",
      title: "Malformed or missing request parameters",
      detail: error.message,
    })
  }
}
