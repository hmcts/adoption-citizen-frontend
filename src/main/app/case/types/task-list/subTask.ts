import { TaskStatus } from './enum/taskStatus';

export class SubTask {
  name: string;
  url: string;
  status: TaskStatus;

  constructor(name: string, url: string, status?: TaskStatus) {
    this.name = name;
    this.url = url;
    this.status = status;
  }
}
