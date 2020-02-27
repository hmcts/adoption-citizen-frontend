import * as express from 'express'
import uuid from 'uuid'
import config from 'config'

import { RoutablePath } from 'common/router/routablePath'
import { Paths } from 'case/paths'
import { buildURL } from 'common/utils/buildURL'

const clientId = config.get<string>('oauth.clientId')
const loginPath = `${config.get('idam.authentication-web.url')}/login`

export class OAuthHelper {
  static forLogin (req: express.Request, res: express.Response, receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = buildURL(req, receiver.uri)
    const state = uuid()
    res.cookie('state', state)

    return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }
}
