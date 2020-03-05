import { SubTask } from './subTask';
import { Alert } from '../alert/alert';

export class Task {
  heading: string;
  subTasks: SubTask[];
  sectionId: string;
  infoAlert: Alert;

  constructor(heading: string, subTasks: SubTask[], sectionId: string, infoAlert?: Alert) {
    this.heading = heading;
    this.subTasks = subTasks;
    this.sectionId = sectionId;
    this.infoAlert = infoAlert;
  }
}