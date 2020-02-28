import * as express from 'express'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { OAuthHelper } from 'idam/oAuthHelper'
// import { RoutablePath } from 'common/router/routablePath'
// import { Paths } from 'case/paths'

export class AdoptionApplication {
  enableFor (app: express.Express) {
    app.all('/*', this.requestHandler())
  }

  requestHandler() {
    function accessDeniedCallback (req: express.Request, res: express.Response): void {
      res.redirect(OAuthHelper.forLogin(req, res))
    }

    const requiredRoles = ['citizen']
    // const unprotectedPaths: string[] = [Paths.something.uri, Paths.something.uri]
    const unprotectedPaths: string[] = []

    return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
  }
}


