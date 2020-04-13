import { expect } from 'chai';
import { SubTask, TaskStatus } from 'case/models';
import * as taskList from 'main/locales/en/taskList.json';

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
