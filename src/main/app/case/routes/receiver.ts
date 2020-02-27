import * as express from 'express'

import Cookies from 'cookies'
import config from 'config'

import { Paths } from 'case/paths'
import { ErrorHandling } from 'common/utils/errorHandling'
import { IdamClient } from 'idam/idamClient'
import { RoutablePath } from 'common/router/routablePath'
import { hasTokenExpired } from 'idam/authorizationMiddleware'
import { OAuthHelper } from 'idam/oAuthHelper'
import { Logger } from '@hmcts/nodejs-logging'
import { trackCustomEvent } from 'logging/customEventTracker'
import { AuthToken } from 'idam/AuthToken'
import { buildURL } from 'common/utils/buildURL'
import { JwtExtractor } from 'idam/jwtExtractor'

const logger = Logger.getLogger('router/receiver')
const sessionCookie = config.get<string>('session.cookieName')
const STATE_COOKIE_NAME = 'state'

export default express.Router()
  .get(Paths.receiver.uri,
    ErrorHandling.apply(async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      const cookies = new Cookies(req, res)
      let user

      try {
        const authenticationToken = await getAuthenticationToken(req)

        if (authenticationToken) {
          user = await IdamClient.getUserFromJwt(authenticationToken)
          res.locals.isLoggedIn = true
          res.locals.user = user
          setAuthCookie(cookies, authenticationToken)
        }
      } catch (e) {
        return loginErrorHandler(req, res, cookies, next, e)
      }

      if (res.locals.isLoggedIn) {
          // redirect to adoption application landing page
      } else {
        if (res.locals.code) {
          trackCustomEvent('Authentication token undefined (jwt defined)',
            { requestValue: req.query.state })
        }
        res.redirect(OAuthHelper.forLogin(req, res))
      }
    })
  )

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
  cookies.set(STATE_COOKIE_NAME, '')
  return next(err)
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken)
  cookies.set(STATE_COOKIE_NAME, '')
}

async function getAuthenticationToken (
  req: express.Request,
  receiver: RoutablePath = Paths.receiver,
  checkCookie = true
): Promise<string> {

  const stateCookie: string = req.cookies['state']
  if (req.query.state != stateCookie) {
    trackCustomEvent('State cookie mismatch (citizen)',
      {
        requestValue: req.query.state,
        cookieValue: stateCookie
      }
    )
  }

  if (req.query.code) {
    const authToken: AuthToken = await IdamClient.getAuthToken(req.query.code, buildURL(req, receiver.uri))
    return authToken.accessToken
  } else if (checkCookie) {
    return JwtExtractor.extract(req)
  }
}
