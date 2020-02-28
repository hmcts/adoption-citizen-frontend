import { AdoptionApplication } from 'case/index'
import * as sinon from 'sinon'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import assert from 'assert'

describe('AdoptionApplication', () => {
  context('requestHandler', () => {

    //This test can be improved
    it('should call requestHandler once', () => {
      const spyRequestHandler = sinon.spy(new AuthorizationMiddleware(), 'requestHandler')
      const spyAccessDeniedCallback = sinon.spy(() => {})

      new AdoptionApplication().requestHandler()

      assert(spyRequestHandler.withArgs([], spyAccessDeniedCallback, []))
    })
  })
})
