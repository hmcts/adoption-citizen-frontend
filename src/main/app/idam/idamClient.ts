import otp from 'otp'
import config from 'config'
import axios from 'axios'

import { ServiceAuthToken } from './serviceAuthToken'
import { User } from 'idam/user'
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

  static getUserFromJwt (jwt: string): Promise<User> {
    return axios
      .get(`${idamApiUrl}/details`, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((response: any) => {
        return new User(
          response.id.toString(),
          response.email,
          response.forename,
          response.surname,
          response.roles,
          response.group,
          jwt
        )
      })
  }

  static getServiceToken (): Promise<ServiceAuthToken> {
    const oneTimePassword = otp({ secret: totpSecret }).totp()

    return axios
      .post(`${s2sUrl}/lease`, new ServiceAuthRequest(microserviceName, oneTimePassword))
      .then((token: any) => {
        return new ServiceAuthToken(token)
      })
      .catch(err => {
        throw new Error(`Unable to get service token - ${err}`)
      })
  }

  static getAuthToken (code: String, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId')
    const clientSecret = config.get<string>('secrets.cmc.citizen-oauth-client-secret')
    const url = `${config.get('idam.api.url')}/oauth2/token`

    return axios
      .post(
        url,
        {
          auth: { username: clientId, password: clientSecret },
          form: { grant_type: 'authorization_code', code: code, redirect_uri: redirectUri }
        })
      .then((response: any) => {
        return new AuthToken(
          response.access_token,
          response.token_type,
          response.expires_in
        )
      })
      .catch((error: any) => {
        trackCustomEvent('failed to get auth token', {
          errorValue: {
            message: error.name,
            code: error.statusCode
          }
        })
        throw error
      })
  }

  static invalidateSession (jwt: string, bearerToken: string): Promise<void> {
    const url = `${config.get('idam.api.url')}/session/${jwt}`
    axios
      .delete(
        url,
        { headers: { Authorization: `Bearer ${bearerToken}`}}
        )
      .catch((error: any) => {
        throw error
      })
    return Promise.resolve()
  }
}
