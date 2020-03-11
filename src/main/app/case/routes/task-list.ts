import * as express from 'express';
import { SubTaskListBuilder } from '../util/subTaskListBuilder';
import { Paths } from 'case/paths';

export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response) => {
    console.log('req.cookies---->', req);
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
