import * as express from 'express';
import { SubTaskListBuilder } from 'case/helpers/subTaskListBuilder';
import { Paths } from 'case/paths';

const router = express.Router();

export default router
  .get(Paths.taskListPage.uri,
    async (req, res) => {

      res.render(Paths.taskListPage.associatedView, {
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
