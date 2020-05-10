import { expect } from 'chai';
import * as taskList from 'main/locales/en/taskList.json';
import { TaskStatus } from 'case/models/task-list/taskStatus';
import { SubTask } from 'case/models/task-list/subTask';

describe('SubTask', () => {
  context('convertTaskStatusToString', () => {

    it('should return completed status when task status is Completed', () => {
      expect(new SubTask('task', 'url', TaskStatus.Complete).status).to.be.eq(taskList.taskStatus.complete);
    });

    it('should return notStarted status when task status is Not started', () => {
      expect(new SubTask('task', 'url', TaskStatus.NotStarted).status).to.be.eq(taskList.taskStatus.notStarted);
    });
  });
});
