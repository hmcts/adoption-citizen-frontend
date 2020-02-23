import { ReceiverHelper } from 'case/helpers/receiverHelper'
import * as express from 'express'
import * as chai from 'chai'
import * as sinon from 'sinon'
import request from 'supertest'

import { mockReq, mockRes } from 'sinon-express-mock'
import { ErrorHandling } from 'common/utils/errorHandling'
import { app } from '../../../../main/app'
import { Paths } from 'case/paths'

const spies =  require('sinon-chai')
let Cookies = require('cookies')
chai.use(spies)
const expect = chai.expect

describe('ReceiverHelper', () => {
  describe('getOAuthAccessToken', () => {
    it('should log appInsights event', async () => {

      await request(app)
        .get(`${Paths.receiver.uri}?code=ABC&state=123`)
        .set('Cookie','sasfd')
        .expect()


      expect(ReceiverHelper.getOAuthAccessToken(mockReq, mockRes))
    })
  })
})
