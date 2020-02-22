import { expect } from 'chai'
import { mockReq as req } from 'sinon-express-mock'
import { BuildURL } from 'main/common/utils/buildURL'

describe('BuildURL', () => {

  describe(`buildURL should create URL `, () => {
    it('for SSL request ', () => {
      const path = 'my/service/path'
      const expected = `https://localhost/${path}`
      req.secure = true
      req.headers = { host: 'localhost' }
      let url = BuildURL(req, path)

      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })

    it('for non SSL request ', () => {
      const path = 'my/service/path'
      const expected = `https://localhost/${path}`
      req.secure = false
      req.headers = { host: 'localhost' }

      let url = BuildURL(req, path)
      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })
  })

  describe(`buildURL should throw error `, () => {
    it('for undefined request ', () => {
      const path = 'my/service/path'
      expect(() => BuildURL(undefined, path)).to.throw(Error, 'Request is undefined')
    })

    it('for null path ', () => {
      req.secure = false
      req.headers = { host: 'localhost' }
      expect(() => BuildURL(req, null)).to.throw(Error, 'Path null or undefined')
    })

    it('for empty path ', () => {
      req.secure = false
      req.headers = { host: 'localhost' }
      expect(() => BuildURL(req, '')).to.throw(Error, 'Path null or undefined')
    })

    it('for undefined path ', () => {
      req.secure = false
      req.headers = { host: 'localhost' }
      expect(() => BuildURL(req, undefined)).to.throw(Error, 'Path null or undefined')
    })
  })

})
