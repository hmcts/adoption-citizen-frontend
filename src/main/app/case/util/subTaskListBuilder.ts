import { SubTask, TaskStatus } from '../types';
import * as taskList from 'main/locales/en/taskList.json';

export class SubTaskListBuilder {

  static buildApplicationDetailsSubTasks(): SubTask[] {
    const applicationDetailSubTasks = taskList.taskItems.applicationDetails.subTasks;

    return [
      new SubTask(applicationDetailSubTasks.numOfChildren, '#', TaskStatus.Complete),
      new SubTask(applicationDetailSubTasks.chooseFamilyCourt, '#'),
    ];
  }

  static buildYourDetailsSubTasks(): SubTask[] {
    const yourDetailsSubTasks = taskList.taskItems.yourDetails.subTasks;

    return [
      new SubTask(yourDetailsSubTasks.personalDetails, '#'),
      new SubTask(yourDetailsSubTasks.contactDetails, '#'),
      new SubTask(yourDetailsSubTasks.relationshipDetails, '#'),
      new SubTask(yourDetailsSubTasks.relationshipDetailsOnlyApplicant, '#'),
      new SubTask(yourDetailsSubTasks.uploadDocuments, '#'),
    ];
  }

  static buildChildDetailsSubTasks(): SubTask[] {
    const childDetailsSubTasks = taskList.taskItems.childDetails.subTasks;

    return [
      new SubTask(childDetailsSubTasks.birthCertficate, '#'),
      new SubTask(childDetailsSubTasks.adoptionCertificate, '#'),
      new SubTask(childDetailsSubTasks.history, '#'),
      new SubTask(childDetailsSubTasks.placementOrderDetails, '#'),
      new SubTask(childDetailsSubTasks.birthMotherDetails, '#'),
      new SubTask(childDetailsSubTasks.birthFatherDetails, '#'),
      new SubTask(childDetailsSubTasks.previousCourtOrder, '#'),
      new SubTask(childDetailsSubTasks.courtOrderDetails, '#'),
    ];
  }

  static buildAdoptionContactsSubTasks(): SubTask[] {
    const adoptionContactsSubTasks = taskList.taskItems.adoptionContacts.subTasks;

    return [
      new SubTask(adoptionContactsSubTasks.socialWorker, '#'),
      new SubTask(adoptionContactsSubTasks.childsSocialWorker, '#'),
      new SubTask(adoptionContactsSubTasks.solictor, '#'),
    ];
  }

  static buildDeclarePaymentsSubTasks(): SubTask[] {
    return [
      new SubTask(taskList.taskItems.declarePayments.subTasks.declarePayments, '#'),
    ];
  }

  static buildReviewApplicationSubTasks(): SubTask[] {
    return [
      new SubTask(taskList.taskItems.reviewApplication.subTasks.reviewApplication, '#'),
    ];
  }
}
