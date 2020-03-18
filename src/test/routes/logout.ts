import * as idamServiceMock from 'test/http-mocks/idam/idam';

import request from 'supertest';
import config from 'config';
import cookie from 'cookie';

import { expect } from 'chai';
import { app } from 'main/app';
import { Paths } from 'main/app/paths';
import * as mock from 'nock';
import supertest from 'supertest';

const cookieName: string = config.get<string>('session.cookieName');

function getCookieValue (res: supertest.Response, cookieName: string): string {
  const cookieKey = res.header['set-cookie']
    .filter(cookie => cookie.includes(cookieName))
    .map(c => cookie.parse(c))
    .pop();
  return cookieKey[cookieName];
}

describe('Logout', () => {
  context('on Get', () => {
    beforeEach(() => {
      mock.cleanAll();
    });

    it('should remove session cookie', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
      idamServiceMock.resolveInvalidateSession('token');

      await request(app)
        .get(Paths.logout.uri)
        .set('Cookie', `${cookieName}=token`)
        .expect(res => expect(getCookieValue(res, `${cookieName}`)).to.be.empty);
    });

    it('should redirect to home page when session cookie is removed', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
      idamServiceMock.resolveInvalidateSession('token');

      await request(app)
        .get(Paths.logout.uri)
        .set('Cookie', `${cookieName}=token`)
        .expect(res => expect(res.header.location).include('/'));
    });

    it('should remove session cookie even when session invalidation is failed ', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      idamServiceMock.rejectInvalidateSession(idamServiceMock.defaultAccessToken, 'bearerToken')

      await request(app)
        .get(Paths.logout.uri)
        .set('Cookie', `${cookieName}=${idamServiceMock.defaultAccessToken}`)
        .expect(res => expect(getCookieValue(res, `${cookieName}`)).to.be.empty);
    });
  });
});
