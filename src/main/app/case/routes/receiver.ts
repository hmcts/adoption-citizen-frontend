import * as express from 'express'
import Cookies from 'cookies'

import { Paths } from 'case/paths'
import { ErrorHandling } from 'common/utils/errorHandling'
import { ReceiverHelper } from 'case/helpers/receiverHelper'
import { IdamClient } from 'idam/idamClient'
import config from 'config'

const sessionCookie = config.get<string>('session.cookieName')
const STATE_COOKIE_NAME = 'state'

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken)
  cookies.set(STATE_COOKIE_NAME, '')
}
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
        return ReceiverHelper.loginErrorHandler(req, res, cookies, next, e)
      }
    })
  )
