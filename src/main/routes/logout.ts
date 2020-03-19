import * as express from 'express';

import { Paths } from 'main/app/paths';
import { JwtExtractor } from 'idam/jwtExtractor';
import { User } from 'idam/user';
import { IdamClient } from 'idam/idamClient';
import { Logger } from '@hmcts/nodejs-logging';

import config from 'config';

const sessionCookie = config.get<string>('session.cookieName');
const logger = Logger.getLogger('routes/logout');

export default express.Router()
  .get(Paths.logout.uri,
    async (req: express.Request, res: express.Response): Promise<void> => {
      const jwt: string = JwtExtractor.extract(req);
      const user: User = await IdamClient.getUserFromJwt(jwt);

      if(jwt) {
        try {
          IdamClient.invalidateSession(jwt);
        } catch (err) {
          logger.error(`Failed invalidating JWT for user  ${user}`);
        }
      }

      res.clearCookie(sessionCookie);
      res.redirect(Paths.homePage.uri);
    });
