import * as idamServiceMocks from 'test/http-mocks/idam/idam'
import { IdamClient } from 'idam/idamClient'
import { expect } from 'chai'
import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { User } from 'idam/user'
import { AuthToken } from 'idam/AuthToken'
import { defaultAuthToken } from 'test/http-mocks/idam/idam'
import * as HttpStatus from 'http-status-codes'

describe('IdamClient', () => {
  context('getUserFromJwt', () => {
    it('should get correct user from json web token', async () => {
      idamServiceMocks.resolveRetrieveUserFor('123', 'adoption-citizen-role')

      const response = await IdamClient.getUserFromJwt(idamServiceMocks.defaultAuthToken)

      expect(response).to.be.instanceOf(User)
      expect(response.email).to.be.equal('user@example.com')
    })

    it('should throw error when unable to get user from json web token', async () => {
      idamServiceMocks.rejectRetrieveUserFor('error')

      try {
        await IdamClient.getUserFromJwt(idamServiceMocks.defaultAuthToken)
      } catch (err) {
        expect(err.response.status).to.be.equal(HttpStatus.FORBIDDEN)
      }

    })
  })

  context('getServiceToken', () => {
    it('should get serviceToken', async () => {

      idamServiceMocks.resolveRetrieveServiceToken()

      const token = await IdamClient.getServiceToken()
      expect(token).to.be.instanceOf(ServiceAuthToken)
    })

    it('should throw error when unable to getServiceToken', async () => {

      idamServiceMocks.rejectRetrieveServiceToken()

      try {
        await IdamClient.getServiceToken()
      } catch (err) {
        expect(err.message).to.be.equal('Unable to get service token - Error: Request failed with status code 400')
      }
    })
  })

  context('getAuthToken', () => {
    it('should get auth token', async () => {
      idamServiceMocks.resolveAuthToken('dummy token')

      const authToken = await IdamClient.getAuthToken('adoption', 'http://redirectUri:4000/receiver')

      expect(authToken).to.be.instanceOf(AuthToken)
      expect(authToken.accessToken).to.be.equal('dummy token')
    })

    it('should throw error when unable to getAuthToken', async () => {

      idamServiceMocks.rejectAuthToken('dummy token')

      try {
        await IdamClient.getAuthToken('adoption', 'http://redirectUri:4000/receiver')
      } catch (err) {
        expect(err.response.status).to.be.equal(HttpStatus.UNAUTHORIZED)
      }
    })
  })

  context('invalidateSession', () => {
    it('should resolve promise when session is invalidated', async () => {
      idamServiceMocks.resolveInvalidateSession(defaultAuthToken)

      const response = await IdamClient.invalidateSession(defaultAuthToken)

      expect(response).to.be.equal(HttpStatus.OK)
    })

    it('should throw error when unable to invalidate session', async () => {
      idamServiceMocks.rejectInvalidateSession(defaultAuthToken)

      try {
        await IdamClient.invalidateSession(defaultAuthToken)
      } catch (err) {
        expect(err.response.status).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })
})
