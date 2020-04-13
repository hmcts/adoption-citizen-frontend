import { TaskStatus } from './taskStatus';
import * as taskList from 'main/locales/en/taskList.json';

export class SubTask {
  name: string;
  url: string;
  status: string;

  constructor(name: string, url: string, status?: TaskStatus) {
    this.name = name;
    this.url = url;
    this.status = SubTask.convertTaskStatusToString(status);
  }

  private static convertTaskStatusToString(status: TaskStatus): string {

    switch (status) {
      case TaskStatus.Complete:
        return taskList.taskStatus.complete;
      case TaskStatus.NotStarted:
        return taskList.taskStatus.notStarted;
    }
  }
}
