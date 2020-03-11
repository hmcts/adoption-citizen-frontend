import * as HttpStatus from 'http-status-codes';
import * as chai from 'chai';
import * as idamServiceMocks from 'test/http-mocks/idam/idam';
import * as sinon from 'sinon';

import { AuthorizationMiddleware, hasValidToken } from 'idam/authorizationMiddleware';
import { mockReq, mockRes } from 'sinon-express-mock';

const spies = require('sinon-chai');
chai.use(spies);
const expect = chai.expect;

describe('AuthorizationMiddleware', () => {
  context('hasTokenExpired', () => {
    it('should return true if err status is forbidden or unauthorized', () => {
      const err1 = {
        statusCode: HttpStatus.FORBIDDEN,
      };
      const err2 = {
        statusCode: HttpStatus.BAD_REQUEST,
      };

      expect(hasValidToken(err1)).to.be.true;
      expect(hasValidToken(err2)).to.be.false;
    });
  });

  context('handleProtectedPaths', () => {

    let nextFunction;
    beforeEach(() => {
      nextFunction = sinon.spy(nextFunction);
    });

    it('should return next function when user has correct role', async () => {

      idamServiceMocks.resolveRetrieveUserFor('123','citizen');

      const req = mockReq({
        cookies: { SESSION_ID: '123'},
      });
      const res = mockRes({
        locals: {
          isLoggedIn: undefined,
          user: undefined,
        },
      });

      await AuthorizationMiddleware.handleProtectedPaths(req, res, nextFunction, ['citizen']);

      expect(nextFunction).to.have.been.called;
    });

    it('should redirect to login page when jwt is invalid', async () => {
      const req = mockReq({
        headers: { host: 'localhost'},
        cookies: { SESSION_ID: undefined},
      });
      const res = mockRes({
        redirect: sinon.stub(),
        cookies: { SESSION_ID: '123'},
      });

      await AuthorizationMiddleware.handleProtectedPaths(req, res, nextFunction, ['citizen']);
      expect(res.redirect).to.have.calledOnce;
    });

    it('should redirect to login page when role is invalid', async () => {
      idamServiceMocks.resolveRetrieveUserFor('123','citizen');

      const req = mockReq({
        headers: { host: 'localhost'},
        cookies: { SESSION_ID: '123'},
      });
      const res = mockRes({
        redirect: sinon.stub(),
        cookies: { SESSION_ID: '123'},
      });
      await AuthorizationMiddleware.handleProtectedPaths(req, res, nextFunction, ['Invalid role']);
      expect(res.redirect).to.have.calledOnce;
    });

    it('should redirect to login page when token is invalid', async () => {
      idamServiceMocks.rejectRetrieveUserFor('Forbidden');

      const req = mockReq({
        headers: { host: 'localhost'},
        cookies: { SESSION_ID: '123'},
      });
      const res = mockRes({
        redirect: sinon.stub(),
        cookies: { SESSION_ID: '123'},
      });
      await AuthorizationMiddleware.handleProtectedPaths(req, res, nextFunction, ['citizen']);
      expect(res.redirect).to.have.calledOnce;
    });
  });
});
