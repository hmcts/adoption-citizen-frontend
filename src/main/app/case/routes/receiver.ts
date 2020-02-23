import * as express from 'express'
import Cookies from 'cookies'
import config from 'config'

import { Paths } from 'case/paths'
import { ErrorHandling } from 'common/utils/errorHandling'
import { ReceiverHelper } from 'case/helpers/receiverHelper'
import { IdamClient } from 'idam/idamClient'
import { RoutablePath } from 'common/router/routablePath'
import { hasTokenExpired } from 'idam/authorizationMiddleware'
import { OAuthHelper } from 'idam/oAuthHelper'
import { Logger } from '@hmcts/nodejs-logging'
import { trackCustomEvent } from 'logging/customEventTracker'

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
        const authenticationToken = await ReceiverHelper.getAuthenticationToken(req)

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
        if (isDefendantFirstContactPinLogin(req)) {
          cookies.set(STATE_COOKIE_NAME, req.query.state)
          // redirect to adoption application dashboard page or task list page
        } else {
          // if no adoption applications for the use redirect to start page
          // else
          // redirect to dashboard or task list page
        }
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

function isDefendantFirstContactPinLogin (req: express.Request): boolean {
  //regex match to adoption case format
  return req.query && req.query.state && req.query.state.match(/[0-9]{3}AD[0-9]{3}/)
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken)
  cookies.set(STATE_COOKIE_NAME, '')
}
