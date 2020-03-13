import * as express from 'express';

import { AuthorizationMiddleware } from '../idam/authorizationMiddleware';

export class AdoptionApplication {
  enableFor (app: express.Express): void {
    app.all('/case/*', this.requestHandler());
  }

  requestHandler() {
    const requiredRoles = [];

    return AuthorizationMiddleware.requestHandler(requiredRoles);
  }
}

