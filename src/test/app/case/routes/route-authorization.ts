import { expect } from 'chai';

import request from 'supertest';
import config from 'config';

import * as idamServiceMock from 'test/http-mocks/idam/idam';
import * as mock from 'nock';

const cookieName: string = config.get<string>('session.cookieName');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function routeAuthorizationChecks (app: any, method: string, pagePath: string) {
  const loginPagePath = '/login';
  beforeEach(() => {
    mock.cleanAll();
  });

  it('should redirect to access denied page when JWT token is missing', async () => {
    await request(app)
      .get(pagePath)
      .expect(res => expect(res.header.location).include(loginPagePath));
  });

  it('should redirect to access denied page when cannot retrieve user details (possibly session expired)', async () => {
    idamServiceMock.rejectRetrieveUserFor('Response 403 from /details');

    await request(app)[method](pagePath)
      .set('Cookie', `${cookieName}=token`)
      .expect(res => expect(res.header.location).include(loginPagePath));
  });

  it('should redirect to access denied page when user not in required role', async () => {
    idamServiceMock.resolveRetrieveUserFor('1', 'invalid role');

    await request.agent(app)[method](pagePath)
      .set('Cookie', `${cookieName}=token`)
      .expect(res => expect(res.header.location).include(loginPagePath));
  });
}
