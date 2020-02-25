import otp from 'otp'
import config from 'config'
import axios from 'axios'

import { ServiceAuthToken } from './serviceAuthToken'
import { User } from './user'
import { AuthToken } from './AuthToken'
import { trackCustomEvent } from 'logging/customEventTracker'

const s2sUrl = config.get<string>('idam.service-2-service-auth.url')
const idamApiUrl = config.get<string>('idam.api.url')
const totpSecret = config.get<string>('secrets.adoption.adoption-s2s-secret')
const microserviceName = config.get<string>('idam.service-2-service-auth.microservice')

class ServiceAuthRequest {
  constructor (public microservice: string, public oneTimePassword: string) {
    this.microservice = microservice
    this.oneTimePassword = oneTimePassword
  }
}

export class IdamClient {

  static async getUserFromJwt (jwt: string): Promise<User> {

    try {
      const { data } = await axios
        .get(`${idamApiUrl}/details`, { headers: { Authorization: `Bearer ${jwt}` } })

      return new User(
        data.id,
        data.email,
        data.forename,
        data.surname,
        data.roles,
        data.group,
        jwt
      )
    } catch (err) {
      throw new Error(`Unable to get user from jwt - ${err}`)
    }
  }

  static async getServiceToken (): Promise<ServiceAuthToken> {
    const oneTimePassword = otp({ secret: totpSecret }).totp()

    try {
      const { data } = await axios
        .post(`${s2sUrl}/lease`, new ServiceAuthRequest(microserviceName, oneTimePassword))
      return new ServiceAuthToken(data)
    } catch (err) {
      throw new Error(`Unable to get service token - ${err}`)
    }
  }

  static async getAuthToken (code: string, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId')
    const clientSecret = config.get<string>('secrets.adoption.citizen-oauth-client-secret')
    const url = `${config.get('idam.api.url')}/oauth2/token`

    try {
      const { data } = await axios
        .post(
          url,
          {
            auth: { username: clientId, password: clientSecret },
            form: { grant_type: 'authorization_code', code: code, redirect_uri: redirectUri }
          })

      return new AuthToken(
        data.access_token,
        data.token_type,
        data.expires_in
      )
    } catch (err) {
      trackCustomEvent('failed to get auth token', {
        errorValue: {
          message: err.name,
          code: err.statusCode
        }
      })
      throw err
    }
  }

  static async invalidateSession (jwt: string): Promise<void> {
    try {
      const url = `${config.get('idam.api.url')}/session/${jwt}`
      const { status } = await axios
        .delete(
          url,
          { headers: { Authorization: `Bearer ${jwt}` } }
        )
      return status
    } catch (err) {
      throw new Error(`Unable to invalidate session - ${err}`)
    }
  }
}
