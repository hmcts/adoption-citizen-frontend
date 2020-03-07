import { AdoptionApplication } from 'case/index';
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware';

import * as sinon from 'sinon';

import assert from 'assert';

describe('AdoptionApplication', () => {
  context('requestHandler', () => {

    it('should call requestHandler once', () => {
      const spyRequestHandler = sinon.spy(AuthorizationMiddleware, 'requestHandler');
      const spyAccessDeniedCallback = sinon.spy(() => {
        // spy function
      });

      new AdoptionApplication().requestHandler();

      assert(spyRequestHandler.calledOnce);
      assert(spyRequestHandler.withArgs([],spyAccessDeniedCallback, []));
    });
  });
});
