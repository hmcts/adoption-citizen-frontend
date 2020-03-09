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

  static requestHandler (
    requiredRoles: string[],
    unprotectedPaths?: string[]): express.RequestHandler {

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      this.handleUnprotectedPaths(unprotectedPaths, req, next);
      this.handleProtectedPaths(req, res, next, requiredRoles);
    };
  }

  static async handleProtectedPaths (req: express.Request, res: express.Response, next: express.NextFunction, requiredRoles: string[]) {

    function accessDeniedRedirect (req: express.Request, res: express.Response): void {
      res.redirect(OAuthHelper.forLogin(req, res));
    }

    const jwt: string = JwtExtractor.extract(req);

    if (!jwt) {
      return accessDeniedRedirect(req, res);
    } else {
      try {
        const user: User = await IdamClient.getUserFromJwt(jwt);

        if (!user.isInRoles(...requiredRoles)) {
          return accessDeniedRedirect(req, res);
        } else {
          res.locals.isLoggedIn = true;
          res.locals.user = user;
          return next();
        }
      } catch (err) {
        if (hasValidToken(err)) {
          logger.debug(`Protected path - invalid JWT - access to ${req.path} rejected`);
          res.cookie(sessionCookieName,'');
          return accessDeniedRedirect(req, res);
        }
        return next(err);
      }
    }
  }

  static handleUnprotectedPaths (unprotectedPaths: string[], req: express.Request, next: express.NextFunction): void {
    if (unprotectedPaths && unprotectedPaths.length !== 0 && unprotectedPaths.includes(req.path)) {
      logger.debug(`Unprotected path - access to ${req.path} granted`);
      return next();
    }
  }
}
