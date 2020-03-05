import { SubTask, TaskStatus } from "..";

export class SubTaskListBuilder {
  static buildApplicationDetailsSubTasks(): SubTask[] {
    return [
      new SubTask('taskList.taskItems.applicationDetails.subTasks.numOfChildren', '#', TaskStatus.Complete),
      new SubTask('taskList.taskItems.applicationDetails.subTasks.chooseFamilyCourt', '#')
    ];
  }

  static buildYourDetailsSubTasks(): SubTask[] {
    return [
      new SubTask('taskList.taskItems.yourDetails.subTasks.personalDetails', '#'),
      new SubTask('taskList.taskItems.yourDetails.subTasks.contactDetails', '#'),
      new SubTask('taskList.taskItems.yourDetails.subTasks.relationshipDetails', '#'),
      new SubTask('taskList.taskItems.yourDetails.subTasks.relationshipDetailsOnlyApplicant', '#'),
      new SubTask('taskList.taskItems.yourDetails.subTasks.uploadDocuments', '#')
    ];
  }

  static buildChildDetailsSubTasks(): SubTask[] {
    return [
      new SubTask('taskList.taskItems.childDetails.subTasks.birthCertficate', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.adoptionCertificate', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.history', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.placementOrderDetails', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.birthMotherDetails', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.birthFatherDetails', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.previousCourtOrder', '#'),
      new SubTask('taskList.taskItems.childDetails.subTasks.courtOrderDetails', '#')
    ];
  }

  static buildAdoptionContactsSubTasks(): SubTask[] {
    return [
      new SubTask('taskList.taskItems.adoptionContacts.subTasks.socialWorker', '#'),
      new SubTask('taskList.taskItems.adoptionContacts.subTasks.childsSocialWorker', '#'),
      new SubTask('taskList.taskItems.adoptionContacts.subTasks.solictor', '#')
    ];
  }

  static buildDeclarePaymentsSubTasks(): SubTask[] {
    return [
      new SubTask('taskList.taskItems.declarePayments.subTasks.declarePayments', '#')
    ];
  }

  static buildReviewApplicationSubTasks(): SubTask[] {
    return [
      new SubTask('taskList.taskItems.reviewApplication.subTasks.reviewApplication', '#')
    ];
  }
}
