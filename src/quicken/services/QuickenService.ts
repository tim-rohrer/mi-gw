import { Err, Ok } from "ts-results-es"
import Logger from "../../common/logger.js"
import QuickenInvestmentParser from "quicken-investment-parser"

/** TODO: Is this appropriate as a pattern in a multi-user
 * environment?
 */
class QuickenService {
  public async fetchQuickenInvestmentData() {
    const qp = new QuickenInvestmentParser("export.csv")
    const { ok, val } = await qp.parsedData()
    Logger.debug(
      `QuickenService.fetchQuickenInvestmentData result: ${JSON.stringify(
        ok,
      )} ${JSON.stringify(val)}`,
    )
    if (ok) return Ok(val)
    return Err(val)
  }
}

export default new QuickenService()
