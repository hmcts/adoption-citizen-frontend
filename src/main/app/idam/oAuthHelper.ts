import * as express from 'express';
import config from 'config';

import { RoutablePath } from 'common/router/routablePath';
import { Paths } from '../paths';
import { buildURL } from 'common/utils/buildURL';
import { Base64 } from 'js-base64';

const clientId = config.get<string>('oauth.clientId');
const loginPath = `${config.get('idam.authentication-web.url')}/login`;

export class OAuthHelper {
  static forLogin (req: express.Request, res: express.Response, landing: RoutablePath = Paths.landing): string {
    const redirectUri = buildURL(req, landing.uri);
    const state = this.toBase64(JSON.stringify({ redirect: req.path }));
    res.cookie('state', state);

    return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`;
  }

  static toBase64 (value: string) {
    return Base64.encode(value);
  }

  static fromBase64(value) {
    return Base64.decode(value);
  }
}
