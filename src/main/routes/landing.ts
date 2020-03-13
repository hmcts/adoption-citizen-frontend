import * as express from 'express';

import Cookies from 'cookies';
import config from 'config';

import { Paths } from '../app/paths';
import { IdamClient } from '../app/idam/idamClient';
import { RoutablePath } from '../app/common/router/routablePath';
import { hasValidToken } from '../app/idam/authorizationMiddleware';
import { OAuthHelper } from '../app/idam/oAuthHelper';
import { Logger } from '@hmcts/nodejs-logging';
import { buildURL } from '../app/common/utils/buildURL';
import { JwtExtractor } from '../app/idam/jwtExtractor';
import { AuthToken } from '../app/idam/AuthToken';
import { ErrorHandling } from '../app/common/utils/errorHandling';

const logger = Logger.getLogger('router/landing');
const sessionCookie = config.get<string>('session.cookieName');
const STATE_COOKIE_NAME = 'state';

function loginErrorHandler (
  req: express.Request,
  res: express.Response,
  cookies: Cookies,
  next: express.NextFunction,
  err: Error,
  landing: RoutablePath = Paths.landing,
) {
  if (hasValidToken(err)) {
    cookies.set(sessionCookie);
    logger.debug(`Protected path - expired auth token - access to ${req.path} rejected`);
    return res.redirect(OAuthHelper.forLogin(req, res, landing));
  }
  cookies.set(STATE_COOKIE_NAME, '');
  return next(err);
}

function setAuthCookie (cookies: Cookies, accessToken: string): void {
  cookies.set(sessionCookie, accessToken);
  cookies.set(STATE_COOKIE_NAME, '');
}

async function getAuthenticationToken (
  req: express.Request,
  landing: RoutablePath = Paths.landing,
  checkCookie = true,
): Promise<AuthToken> {

  let authenticationToken;
  if (req.query.code) {
    authenticationToken = await IdamClient.getAuthToken(req.query.code, buildURL(req, landing.uri));
  } else if (checkCookie) {
    authenticationToken = JwtExtractor.extract(req);
  }
  return authenticationToken;
}

export default express.Router()
  .get(Paths.landing.uri, ErrorHandling.apply(async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    const cookies = new Cookies(req, res);
    let user;

    try {
      const authenticationToken = await getAuthenticationToken(req);

      if (authenticationToken) {
        const accessToken: string = authenticationToken.accessToken;
        user = await IdamClient.getUserFromJwt(accessToken);
        res.locals.isLoggedIn = true;
        res.locals.user = user;
        setAuthCookie(cookies, accessToken);
      }
    } catch (err) {
      return loginErrorHandler(req, res, cookies, next, err);
    }

    if (res.locals.isLoggedIn) {
      // redirect to task list page
    } else {
      res.redirect(OAuthHelper.forLogin(req, res));
    }
  },
  ));
