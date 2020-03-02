import * as express from 'express'

const router = express.Router()

/* GET home page. */
router.get('/task-list', (req, res, next) => {
  res.render('task-list')
})

module.exports = router