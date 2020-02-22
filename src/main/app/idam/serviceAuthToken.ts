import { Base64 } from 'js-base64'
import moment from 'moment'

export class ServiceAuthToken {
  constructor (public bearerToken: string) {
    this.bearerToken = bearerToken
  }

  hasExpired (): boolean {
    const { exp } = this.decodePayload(this.bearerToken)
    return moment().unix() >= exp
  }

  private decodePayload (jwt: string): {[key: string]: any} {
    try {
      const payload = jwt.substring(jwt.indexOf('.'), jwt.lastIndexOf('.'))

      return JSON.parse(Base64.decode(payload))
    } catch (err) {
      throw new Error(`Unable to parse JWT token: ${jwt}`)
    }
  }
}
