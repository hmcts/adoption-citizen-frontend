import * as HttpStatus from 'http-status-codes'
import * as chai from 'chai'
import { hasTokenExpired } from 'idam/authorizationMiddleware'

const spies = require('sinon-chai')
chai.use(spies)
const expect = chai.expect

describe('AuthorizationMiddleware', () => {
  describe('hasTokenExpired', () => {
    it('should return true if err status is forbidden or unauthorized', () => {
      const err1 = {
        statusCode: HttpStatus.FORBIDDEN
      }
      const err2 = {
        statusCode: HttpStatus.BAD_REQUEST
      }

      expect(hasTokenExpired(err1)).to.be.true
      expect(hasTokenExpired(err2)).to.be.false
    })
  })

  describe('requestHandler', () => {
    it('should return express nest function for unprotected paths', () => {

    })
  })
})
