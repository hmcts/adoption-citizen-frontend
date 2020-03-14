import { expect } from 'chai';
import { app } from 'main/app';
import { Paths } from 'case/paths';
import { defaultAccessToken } from 'test/http-mocks/idam/idam';
import { routeAuthorizationChecks } from './route-authorization';

import request from 'supertest';
import config from 'config';

import * as idamServiceMock from 'test/http-mocks/idam/idam';
import * as mock from 'nock';

const cookieName: string = config.get<string>('session.cookieName');

describe('Home page', () => {
  describe('on GET', () => {
    beforeEach(() => {
      mock.cleanAll();
    });

    routeAuthorizationChecks(app, 'get', Paths.taskListPage.uri);

    it('should return task list', async () => {
      idamServiceMock.resolveAuthToken(defaultAccessToken);
      idamServiceMock.resolveRetrieveUserFor('123','citizen');

      await request(app)
        .get(Paths.taskListPage.uri)
        .set('Cookie', `${cookieName}=token`)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
