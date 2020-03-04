import request from 'supertest'
import * as idamServiceMock from 'test/http-mocks/idam/idam'
import { app } from 'main/app'
import { Paths } from 'case/paths'

describe('Login landing page', async () => {
  describe('on Get', async () => {

    it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
      const token = 'I am dummy access token'

      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      idamServiceMock.resolveAuthToken(token)

      await request(app)
        .get(Paths.landing.uri)
        .expect(
          res => console.log(res.header.location))
      console.log('test finished')
    })
  })
})
