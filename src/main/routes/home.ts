import * as express from 'express';
import { Paths } from '../app/paths';

export default express.Router()
  .get(Paths.homePage.uri, (req, res) =>{
    res.redirect(Paths.landing.uri);
  });
