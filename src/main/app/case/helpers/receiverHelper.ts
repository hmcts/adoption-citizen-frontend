import * as express from 'express'
import * as Cookies from 'cookies'

import config from 'config'

import { RoutablePath } from 'common/router/routablePath'
import { OAuthHelper } from 'idam/oAuthHelper'
import { trackCustomEvent } from 'logging/customEventTracker'
import { AuthToken } from 'idam/AuthToken'
import { IdamClient } from 'idam/idamClient'
import { buildURL } from 'common/utils/buildURL'
import { Paths } from 'case/paths'
import { JwtExtractor } from 'idam/jwtExtractor'
import { hasTokenExpired } from 'idam/authorizationMiddleware'
import { Logger } from "@hmcts/nodejs-logging"

const logger = Logger.getLogger('router/receiver')
const sessionCookie = config.get<string>('session.cookieName')
const STATE_COOKIE_NAME = 'state'

async function getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
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

async function getAuthenticationToken (
  req: express.Request,
  receiver: RoutablePath = Paths.receiver,
  checkCookie = true
) {
  let authenticationToken

  if (req.query.code) {
    authenticationToken = await getOAuthAccessToken(req, receiver)
  } else if (checkCookie) {
    authenticationToken = JwtExtractor.extract(req)
  }
  return authenticationToken
}

function loginErrorHandler (
  req: express.Request,
  res: express.Response,
  cookies: Cookies,
  next: express.NextFunction,
  err: Error,
  receiver: RoutablePath = Paths.receiver
) {
  if (hasTokenExpired(err)) {
    cookies.set(sessionCookie)
    logger.debug(`Protected path - expired auth token - access to ${req.path} rejected`)
    return res.redirect(OAuthHelper.forLogin(req, res, receiver))
  }
  cookies.set(STATE_COOKIE_NAME,'')
  return next(err)
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken)
  cookies.set(STATE_COOKIE_NAME,'')
}
