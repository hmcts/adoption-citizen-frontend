import * as express from 'express';

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware';
// import { RouterFinder } from 'router/routerFinder'

// import path from 'path'

export class AdoptionApplication {
  enableFor (app: express.Express): void {
    app.all('/case/*', this.requestHandler());
    // app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }

  requestHandler() {
    const requiredRoles = [];
    // const unprotectedPaths: string[] = [Paths.something.uri, Paths.something.uri]
    const unprotectedPaths: string[] = [];

    return AuthorizationMiddleware.requestHandler(requiredRoles, unprotectedPaths);
  }
}

