import * as path from 'path';
import * as express from 'express';

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware';
import { RouterFinder } from 'router/routerFinder';

export class AdoptionApplication {
  enableFor (app: express.Express): void {
    app.all('/case/*', this.requestHandler());
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')));
  }

  requestHandler() {
    const requiredRoles = ['citizen'];

    return AuthorizationMiddleware.requestHandler(requiredRoles);
  }
}

