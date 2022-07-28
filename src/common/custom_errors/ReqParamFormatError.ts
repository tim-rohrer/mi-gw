import ValidationError from "./ValidationError.js"

class ReqParamFormatError extends ValidationError {
  param: string

  constructor(param: string, detail: string) {
    super()
    this.param = param
    this.message = `Parameter ${this.param}: ${detail}.`
  }
}

export default ReqParamFormatError
