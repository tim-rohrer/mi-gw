import { MapperRegistry } from "http-problem-details-mapper"

import APITokenFormatError from "../custom_errors/APITokenFormatError.js"
import ErrorProblemMappingStrategy from "../ErrorProblemMappingStrategy.js"
import APITokenFormatErrorMapper from "./APITokenFormatErrorMapper.js"

describe("Strategy/Mapper", () => {
  it("maps using defaults with problem details as parameter", () => {
    const strategy = new ErrorProblemMappingStrategy(
      new MapperRegistry().registerMapper(new APITokenFormatErrorMapper()),
    )
    const error = new APITokenFormatError(
      "Your request was missing a proper API Token.",
    )

    const problem = strategy.map(error)

    expect(problem).toEqual({
      type: "/errors/api-token-format-error",
      title: "Malformed or missing API Token",
      instance: undefined,
      detail: "Your request was missing a proper API Token.",
      status: 400,
    })
  })
})
