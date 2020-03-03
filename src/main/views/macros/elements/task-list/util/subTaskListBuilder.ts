import { SubTask, TaskStatus } from "..";

export class SubTaskListBuilder {
  static buildApplicationDetailsSubTasks(): SubTask[] {
    return [
      new SubTask('Number of children and applicants', '#', TaskStatus.Completed),
      new SubTask('Choose your family court', '#')
    ];
  };

  static buildYourDetailsSubTasks(): SubTask[] {
    return [
      new SubTask('Your personal details', '#'),
      new SubTask('Your contact details', '#'),
      new SubTask('Your relationship details', '#'),
      new SubTask('Your relationship (if the user said they were the only applicant)', '#'),
      new SubTask('Upload your identity documents', '#')
    ];
  };

  static buildChildDetailsSubTasks(): SubTask[] {
    return [
      new SubTask('Their birth certificate details', '#'),
      new SubTask('Adoption certificate details', '#'),
      new SubTask('Their history with you', '#'),
      new SubTask('Their placement order details', '#'),
      new SubTask('Their birth mother\'s details', '#'),
      new SubTask('Their birth father\'s or other parent\'s details', '#'),
      new SubTask('Previous court order for the child', '#'),
      new SubTask('Court order details for any siblings or half-siblings', '#')
    ];
  };

  static buildAdoptionContactsSubTasks(): SubTask[] {
    return [
      new SubTask('Your social worker or adoption agency', '#'),
      new SubTask('The child\'s social worker', '#'),
      new SubTask('Your solictor, if relevant', '#')
    ];
  };

  static buildDeclarePaymentsSubTasks(): SubTask[] {
    return [
      new SubTask('Declare any payments made or received', '#')
    ];
  };

  static buildReviewApplicationSubTasks(): SubTask[] {
    return [
      new SubTask('Review application, pay and send', '#')
    ];
  };
}
