import * as express from 'express'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { OAuthHelper } from 'idam/oAuthHelper'

export class AdoptionApplication {
  enableFor (app: express.Express) {
    app.all('/*', this.requestHandler())
  }

  private requestHandler() {
    function accessDeniedCallback (req: express.Request, res: express.Response): void {
      res.redirect(OAuthHelper.forLogin(req, res))
    }

    const requiredRoles = ['citizen']
    const unprotectedPaths = []

    return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
  }
}


