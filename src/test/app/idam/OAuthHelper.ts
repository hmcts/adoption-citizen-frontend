import { OAuthHelper } from 'idam/oAuthHelper';
import { mockReq, mockRes } from 'sinon-express-mock';
import { expect } from 'chai';

describe('OAuthHelper', () => {
  context('forLogin', () => {
    it('should return idam login redirect uri', () => {
      const req = mockReq({
        headers: { host: 'localhost' },
      });
      const res = mockRes({
        cookies: { SESSION_ID: '123' },
      });

      const redirectUri = OAuthHelper.forLogin(req, res);
      expect(redirectUri).to.be.contain('client_id=adoption&redirect_uri=https://localhost/landing');
    });
  });
});
