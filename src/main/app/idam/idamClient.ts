import otp from 'otp'
import config from 'config'
import request from 'request-promise'

import { ServiceAuthToken } from './serviceAuthToken'
import { User } from './user'
import { AuthToken } from './AuthToken'

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
    const requestOptions = Object.assign({
      url: `${idamApiUrl}/details`,
      headers: { Authorization: `Bearer ${jwt}` }
    })

    const response = await request
      .get(requestOptions)
    const data = JSON.parse(response)

    return new User(
      data.id,
      data.email,
      data.forename,
      data.surname,
      data.roles,
      data.group,
      jwt
    )
  }

  static async getServiceToken (): Promise<ServiceAuthToken> {
    const oneTimePassword = otp({ secret: totpSecret }).totp()

    try {
      const data = await request
        .post({
          uri: `${s2sUrl}/lease`,
          body: new ServiceAuthRequest(microserviceName, oneTimePassword)})

      return new ServiceAuthToken(JSON.parse(data))
    } catch (err) {
      throw new Error(`Unable to get service token - ${err}`)
    }
  }

  static async getAuthToken (code: string, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId')
    const clientSecret = config.get<string>('secrets.adoption.citizen-oauth-client-secret')
    const url = `${config.get('idam.api.url')}/oauth2/token`

    const formData = Object.assign({}, {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirectUri
    })

    const requestOptions = Object.assign({
      url: url,
      form: formData,
      auth: {
        user: clientId,
        pass: clientSecret
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const data = JSON.parse(await request.post(requestOptions))
    return new AuthToken(
      data.access_token,
      data.token_type,
      data.expires_in
    )
  }

  static async invalidateSession (jwt: string): Promise<void> {
    const url = `${config.get('idam.api.url')}/session/${jwt}`
    const { status } = await request
      .delete(
        url,
        { headers: { Authorization: `Bearer ${jwt}` } }
      )
    return status

  }
}
