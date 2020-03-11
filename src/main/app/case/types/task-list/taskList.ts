import { Task } from './task';

export class TaskList {
  constructor (public tasks: Task[]) {
    this.tasks = tasks;
  }
}
