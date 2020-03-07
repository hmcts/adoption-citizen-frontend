import * as idamServiceMocks from 'test/http-mocks/idam/idam';
import { IdamClient } from 'idam/idamClient';
import { expect } from 'chai';
import { User } from 'idam/user';
import { AuthToken } from 'idam/AuthToken';
import { defaultAccessToken } from 'test/http-mocks/idam/idam';
import * as HttpStatus from 'http-status-codes';

describe('IdamClient', () => {
  context('getUserFromJwt', () => {
    it('should get correct user from json web token', async () => {
      idamServiceMocks.resolveRetrieveUserFor('123', 'adoption-citizen-role');

      const response = await IdamClient.getUserFromJwt(idamServiceMocks.defaultAccessToken);

      expect(response).to.be.instanceOf(User);
      expect(response.email).to.be.equal('user@example.com');
    });
  });

  context('getAuthToken', async () => {
    it('should get auth token', async () => {
      idamServiceMocks.resolveAuthToken(defaultAccessToken);

      const authToken = await IdamClient.getAuthToken('adoption', 'http://redirectUri:4000/landing');

      expect(authToken).to.be.instanceOf(AuthToken);
      expect(authToken.accessToken).to.be.equal(defaultAccessToken);
    });

    it('should throw error when unable to getAuthToken', async () => {

      idamServiceMocks.rejectAuthToken('dummy token');

      try {
        await IdamClient.getAuthToken('adoption', 'http://redirectUri:4000/landing');
      } catch (err) {
        expect(err.statusCode).to.be.equal(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  context('invalidateSession', () => {
    it('should resolve promise when session is invalidated', async () => {
      idamServiceMocks.resolveInvalidateSession(defaultAccessToken);

      try {
        await IdamClient.invalidateSession(defaultAccessToken);
      } catch (err) {
        expect(err.response.status).to.be.not.equal(HttpStatus.OK);
      }
    });

    it('should throw error when unable to invalidate session', async () => {
      idamServiceMocks.rejectInvalidateSession(defaultAccessToken);

      try {
        await IdamClient.invalidateSession(defaultAccessToken);
      } catch (err) {
        expect(err.statusCode).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
