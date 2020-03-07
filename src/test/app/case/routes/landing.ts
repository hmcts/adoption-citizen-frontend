import { expect } from 'chai';
import { app } from 'main/app';
import { Paths } from '../../../../main/app/paths';
import { defaultAccessToken, defaultAuthToken } from 'test/http-mocks/idam/idam';

import request from 'supertest';
import * as idamServiceMock from 'test/http-mocks/idam/idam';

describe('landing', async () => {
  context('get', async () => {
    it('should redirect to user login page when unable to get Authentication token', async () => {
      idamServiceMock.rejectAuthToken();

      await request(app)
        .get(Paths.landing.uri)
        .set('Cookie', 'state=123')
        .expect(res => expect(res.header.location).include('/login'));
    });

    // TODO: Update test to redirect to task-list page when task-list changes are complete
    it('should redirect to task list page when user is retrieved from jwt', async () => {
      idamServiceMock.resolveAuthToken(defaultAuthToken);
      idamServiceMock.resolveRetrieveUserFor(defaultAccessToken);

      await request(app)
        .get(Paths.landing.uri)
        .set('Cookie', 'state=123');
      // .expect(res => expect(res.header.location).include('/task-list'))
    });
  });
});
