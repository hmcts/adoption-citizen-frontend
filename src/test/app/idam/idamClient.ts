import * as idamServiceMock from 'test/http-mocks/idam/idam'
import { IdamServiceToken } from 'main/app/idam/idamServiceToken'
import { ServiceAuthToken } from 'main/app/idam/serviceAuthToken'

describe('IdamClient', () => {
  describe('getValidServiceToken', () => {
    const idamServiceToken = new IdamServiceToken(new ServiceAuthToken(idamServiceMock.defaultAuthToken))
    console.log(idamServiceToken.getValidServiceToken())
  })
})
