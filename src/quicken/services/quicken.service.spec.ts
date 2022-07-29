import QuickenInvestmentParser from "quicken-investment-parser"
import { ParsedData } from "quicken-investment-parser/dist/QuickenInvestmentParser"
import { ErrImpl, OkImpl } from "ts-results-es"

import { jest } from "@jest/globals"

const mockAddImport = jest.fn()

jest.unstable_mockModule("../../storage/quicken.mongodb.service.js", () => ({
  addImport: mockAddImport,
}))

const quickenServiceModule = await import("./quicken.service.js")

test("fetchQuickenInvestmentData should return an array", async () => {
  const mockVal: ParsedData = [
    JSON.stringify({
      test: "data",
    }),
  ]
  jest
    .spyOn(QuickenInvestmentParser.prototype, "parsedData")
    .mockResolvedValue(<OkImpl<ParsedData>>{
      ok: true,
      err: false,
      val: mockVal,
    })

  const { ok, val } = await quickenServiceModule.fetchQuickenInvestmentData()

  expect(ok).toBe(true)
  expect(val).toBeInstanceOf(Array)
})
test("fetchQuickenInvestmentData should handle an error from the parser", async () => {
  jest
    .spyOn(QuickenInvestmentParser.prototype, "parsedData")
    .mockResolvedValue(<ErrImpl<any>>{
      ok: false,
      err: true,
      val: new Error("fail"),
    })

  const { err, val } = await quickenServiceModule.fetchQuickenInvestmentData()

  expect(err).toBe(true)
  expect(val).toBeInstanceOf(Error)
})
test("storeQuickenImport invokes the store", async () => {
  const importData = {
    createdTimestamp: new Date(),
    data: ["string1", "string2"],
  }
  mockAddImport.mockImplementation(async () => ({
    acknowledged: true,
    insertedId: "testObjectId",
  }))

  const result = await quickenServiceModule.storeQuickenImport(importData)

  expect(result.acknowledged).toBe(true)
  expect(result.insertedId).toBe("testObjectId")
})
