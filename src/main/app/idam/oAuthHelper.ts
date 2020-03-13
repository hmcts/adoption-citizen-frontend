import * as express from 'express';
import uuid from 'uuid';
import config from 'config';

import { RoutablePath } from '../common/router/routablePath';
import { Paths } from '../paths';
import { buildURL } from '../common/utils/buildURL';

const clientId = config.get<string>('oauth.clientId');
const loginPath = `${config.get('idam.authentication-web.url')}/login`;

export class OAuthHelper {
  static forLogin (req: express.Request, res: express.Response, landing: RoutablePath = Paths.landing): string {
    const redirectUri = buildURL(req, landing.uri);
    const state = uuid();
    res.cookie('state', state);

    return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`;
  }
}
