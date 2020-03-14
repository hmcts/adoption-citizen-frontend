import { expect } from 'chai';
import { app } from 'main/app';
import { Paths } from 'main/app/paths';
import { defaultAccessToken } from 'test/http-mocks/idam/idam';

import request from 'supertest';
import * as idamServiceMock from 'test/http-mocks/idam/idam';
import * as mock from 'nock';

describe('landing', async () => {
  context('on Get', async () => {
    beforeEach(() => {
      mock.cleanAll();
    });

    it('should redirect to user login page when unable to get Authentication token', async () => {
      idamServiceMock.rejectAuthToken();

      await request(app)
        .get(Paths.landing.uri)
        .expect(res => expect(res.header.location).include('/login'));
    });

    it('should redirect to user login page when unable to get user from auth token', async () => {
      idamServiceMock.resolveAuthToken(defaultAccessToken);
      idamServiceMock.rejectRetrieveUserFor('invalid user');

      await request(app)
        .get(`${Paths.landing.uri}?code=token`)
        .expect(res => expect(res.header.location).include('/login'));
    });

    it('should redirect to task list page when user is retrieved from jwt', async () => {
      idamServiceMock.resolveAuthToken(defaultAccessToken);
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen');

      await request(app)
        .get(`${Paths.landing.uri}?code=token`)
        .expect(res => expect(res.header.location).include('/case/task-list'));
    });
  });
});
