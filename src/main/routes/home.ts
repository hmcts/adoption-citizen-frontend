import * as express from 'express'
import { Paths } from 'case/paths'

export default express.Router()
  .get(Paths.homePage.uri, (req, res) =>{
    res.redirect(Paths.receiver.uri)
})
