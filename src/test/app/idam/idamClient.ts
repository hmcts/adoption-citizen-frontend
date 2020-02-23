import * as idamServiceMocks from 'test/http-mocks/idam/idam'
import { IdamClient } from 'idam/idamClient'
import { expect } from 'chai'
import { ServiceAuthToken } from 'idam/serviceAuthToken'

describe('IdamClient', () => {
  it('getServiceToken', async () => {

    idamServiceMocks.resolveRetrieveServiceToken()

    const token = await IdamClient.getServiceToken()
    expect(token).to.be.instanceOf(ServiceAuthToken)
  })

  it('Unable to getServiceToken', async () => {

    idamServiceMocks.rejectRetrieveServiceToken()

    try {
      await IdamClient.getServiceToken()
    } catch (err) {
      expect(err.message).to.be.equal('Unable to get service token - Error: Request failed with status code 400')
    }
  })
})
