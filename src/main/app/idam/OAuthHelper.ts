import * as express from 'express'

import { RoutablePath } from 'main/common/router/routablePath'
import { Paths } from '../case/paths'

export class OAuthHelper {
  static forLogin (
    req: express.Request,
    res: express.Response,
    receiver: RoutablePath = Paths.receiver
  ): string {

  }
}
