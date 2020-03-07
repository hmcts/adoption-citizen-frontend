import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import moment from 'moment';

import { ServiceAuthToken } from 'main/app/idam/serviceAuthToken';

describe('ServiceAuthToken', () => {
  describe('hasExpired', () => {
    it('should throw an error when token is tampered', () => {
      expect(() => new ServiceAuthToken('tampered-jwt-token').hasExpired())
        .to.throw(Error, 'Unable to parse JWT token: tampered-jwt-token');
    });
    it('should return true when token has expired', () => {
      const token = jwt.sign({ exp: moment().unix() }, 'secret');
      expect(new ServiceAuthToken(token).hasExpired()).to.be.true;
    });

    it('should return false when token has not expired yet', () => {
      const token = jwt.sign({ exp: moment().add(1, 'second').unix() }, 'secret');
      expect(new ServiceAuthToken(token).hasExpired()).to.be.false;
    });
  });
});
