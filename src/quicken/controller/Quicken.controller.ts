import express from "express"
import Logger from "../../common/logger.js"
import quickenService from "../services/QuickenService.js"

export default class QuickenController {
  uploadCSV(): boolean {
    throw new Error("Method not implemented.")
  }

  static async getData(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const { ok, val } = await quickenService.fetchQuickenInvestmentData()
    if (ok) {
      Logger.info(`fetch result being returned ${JSON.stringify(val)}`)
      res.status(200).json(val)
    } else {
      Logger.error(`${JSON.stringify(val)}`)
      next(val)
    }
  }

  // public static async geocode(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> {
  //   const query = req.query as unknown as GoogleGeocodeRequestParamsDTO
  //   Logger.debug(
  //     `geocodesService.getGoogleGeocode to be run with ${JSON.stringify(
  //       query,
  //     )}`,
  //   )
  //   const geocodeResult = await geocodesService.getGoogleGeocode(
  //     query,
  //     res.locals.clientInfo,
  //   )
  //   Logger.debug(
  //     `geocodesService.getGoogleGeocode result ${JSON.stringify(
  //       geocodeResult,
  //     )}`,
  //   )
  //   if (geocodeResult.ok) {
  //     Logger.info(
  //       `Geocode result being returned ${JSON.stringify(geocodeResult.val)}`,
  //     )
  //     res.status(200).json(geocodeResult.val)
  //   } else next(geocodeResult.val)
  // }
}
