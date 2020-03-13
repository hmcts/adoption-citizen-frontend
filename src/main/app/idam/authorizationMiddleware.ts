import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

import { JwtExtractor } from 'idam/jwtExtractor';
import { IdamClient } from 'idam/idamClient';
import { User } from 'idam/user';
import { Logger } from '@hmcts/nodejs-logging';
import { OAuthHelper } from 'idam/oAuthHelper';

import config from 'config';

const sessionCookieName = config.get<string>('session.cookieName');
const logger = Logger.getLogger('middleware/authorization');

export function hasValidToken (err): boolean {
  return (err.statusCode === HttpStatus.FORBIDDEN || err.statusCode === HttpStatus.UNAUTHORIZED);
}

export class AuthorizationMiddleware {

  static requestHandler (requiredRoles: string[]): express.RequestHandler {

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      this.handleProtectedPaths(req, res, next, requiredRoles);
    };
  }

  static async handleProtectedPaths (req: express.Request, res: express.Response, next: express.NextFunction, requiredRoles: string[]) {

    function accessDeniedRedirect (): void {
      res.redirect(OAuthHelper.forLogin(req, res));
    }

    const jwt: string = JwtExtractor.extract(req);

    if (!jwt) {
      return accessDeniedRedirect();
    } else {
      try {
        const user: User = await IdamClient.getUserFromJwt(jwt);

        if (!user.isInRoles(...requiredRoles)) {
          return accessDeniedRedirect();
        } else {
          res.locals.isLoggedIn = true;
          res.locals.user = user;
          return next();
        }
      } catch (err) {
        if (hasValidToken(err)) {
          logger.error(`Protected path - invalid JWT - access to ${req.path} rejected - ${err})`);
          res.cookie(sessionCookieName,'');
          return accessDeniedRedirect();
        }
        return next(err);
      }
    }
  }
}
