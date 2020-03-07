import * as express from 'express';
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware';
import { OAuthHelper } from 'idam/oAuthHelper';
// import { RouterFinder } from 'router/routerFinder'
// import path from 'path'

export class AdoptionApplication {
  enableFor (app: express.Express): void {
    app.all('/case/*', this.requestHandler());
    // app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }

  requestHandler() {
    function accessDeniedCallback (req: express.Request, res: express.Response): void {
      res.redirect(OAuthHelper.forLogin(req, res));
    }

    const requiredRoles = [];
    // const unprotectedPaths: string[] = [Paths.something.uri, Paths.something.uri]
    const unprotectedPaths: string[] = [];

    return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
  }
}

