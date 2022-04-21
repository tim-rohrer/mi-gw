import ValidationError from "./ValidationError.js"

class APITokenFormatError extends ValidationError {
  detail: string

  constructor(detail: string) {
    super()
    this.message = detail
  }
}

export default APITokenFormatError
