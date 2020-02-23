import * as express from 'express'

import { RoutablePath } from 'common/router/routablePath'
import { OAuthHelper } from 'idam/oAuthHelper'
import { trackCustomEvent } from 'logging/customEventTracker'
import { AuthToken } from 'idam/AuthToken'
import { IdamClient } from 'idam/idamClient'
import { buildURL } from 'common/utils/buildURL'
import { Paths } from 'case/paths'
import { JwtExtractor } from 'idam/jwtExtractor'

export class ReceiverHelper {
  static async getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
    if (req.query.state != OAuthHelper.getStateCookie(req)) {
      trackCustomEvent('State cookie mismatch (citizen)',
        {
          requestValue: req.query.state,
          cookieValue: OAuthHelper.getStateCookie(req)
        }
      )
    }

    const authToken: AuthToken = await IdamClient.getAuthToken(req.query.code, buildURL(req, receiver.uri))

    if (authToken) {
      return authToken.accessToken
    }

    return Promise.reject()
  }

  static async getAuthenticationToken (
    req: express.Request,
    receiver: RoutablePath = Paths.receiver,
    checkCookie = true
  ) {
    let authenticationToken

    if (req.query.code) {
      authenticationToken = await ReceiverHelper.getOAuthAccessToken(req, receiver)
    } else if (checkCookie) {
      authenticationToken = JwtExtractor.extract(req)
    }
    return authenticationToken
  }
}
