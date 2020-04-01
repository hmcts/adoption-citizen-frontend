import * as path from 'path';
import * as express from 'express';

import config from 'config';

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware';
import { RouterFinder } from 'router/routerFinder';

const requiredRoles = config.get<string[]>('roles');

export class AdoptionApplication {
  enableFor (app: express.Express): void {
    console.log('Enabled for /case/ -->');
    app.all('/case/*', this.requestHandler());
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')));
  }

  requestHandler() {

    return AuthorizationMiddleware.requestHandler(requiredRoles);
  }
}

