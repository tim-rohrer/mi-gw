import { jest } from "@jest/globals"
import QuickenInvestmentParser from "quicken-investment-parser"
import { ParsedData } from "quicken-investment-parser/dist/QuickenInvestmentParser"
import { ErrImpl, OkImpl } from "ts-results-es"
import quickenService from "./QuickenService"

describe("Quicken Service", () => {
  describe("fetchQuickenInvestmentData", () => {
    it("should return an array", async () => {
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

      const { ok, val } = await quickenService.fetchQuickenInvestmentData()

      expect(ok).toBe(true)
      expect(val).toBeInstanceOf(Array)
    })
    it("should handle an error from the parser", async () => {
      jest
        .spyOn(QuickenInvestmentParser.prototype, "parsedData")
        .mockResolvedValue(<ErrImpl<any>>{
          ok: false,
          err: true,
          val: new Error("fail"),
        })

      const { err, val } = await quickenService.fetchQuickenInvestmentData()

      expect(err).toBe(true)
      expect(val).toBeInstanceOf(Error)
    })
  })
})
