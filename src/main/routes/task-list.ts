import * as express from 'express';
import { SubTaskListBuilder } from '../app/case/util/subTaskListBuilder';

const router = express.Router();

router.get('/task-list', (req, res) => {
  res.render('task-list', {
    tasks: {
      applicantDetails: SubTaskListBuilder.buildApplicationDetailsSubTasks(),
      yourDetails: SubTaskListBuilder.buildYourDetailsSubTasks(),
      childDetails: SubTaskListBuilder.buildChildDetailsSubTasks(),
      adoptionContacts: SubTaskListBuilder.buildAdoptionContactsSubTasks(),
      declarePayments: SubTaskListBuilder.buildDeclarePaymentsSubTasks(),
      reviewApplication: SubTaskListBuilder.buildReviewApplicationSubTasks(),
    },
  });
});

module.exports = router;
