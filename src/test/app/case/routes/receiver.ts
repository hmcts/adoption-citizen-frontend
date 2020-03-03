import { expect } from 'chai'
import request from 'supertest'
import config from 'config'
import * as idamServiceMock from 'test/http-mocks/idam/idam'
import { app } from 'main/app'
import { Paths } from 'case/paths'

const cookieName: string = config.get<string>('session.cookieName')

describe('Login receiver page', async () => {
  describe('on Get', async () => {

    it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
      const token = 'I am dummy access token'

      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      idamServiceMock.resolveAuthToken(token)

      await request(app)
        .get(Paths.receiver.uri)
        .expect(
          res => console.log(res.header.location))
      console.log('test finished')
    })
  })
})
