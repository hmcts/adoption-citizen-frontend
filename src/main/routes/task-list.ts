import * as express from 'express'
import { SubTaskListBuilder } from '../views/macros/elements/task-list/util/subTaskListBuilder';

const router = express.Router()

router.get('/task-list', (req, res, next) => {
  res.render('task-list', {
    tasks: {
      applicantDetails: SubTaskListBuilder.buildApplicationDetailsSubTasks(),
      yourDetails: SubTaskListBuilder.buildYourDetailsSubTasks(),
      childDetails: SubTaskListBuilder.buildChildDetailsSubTasks(),
      adoptionContacts: SubTaskListBuilder.buildAdoptionContactsSubTasks(),
      declarePayments: SubTaskListBuilder.buildDeclarePaymentsSubTasks(),
      reviewApplication: SubTaskListBuilder.buildReviewApplicationSubTasks()
    }
  })
})

module.exports = router