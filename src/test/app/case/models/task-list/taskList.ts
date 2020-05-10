import { expect } from 'chai';
import { SubTask } from 'case/models/task-list/subTask';
import { TaskStatus } from 'case/models/task-list/taskStatus';
import { Alert } from 'case/models/alert/alert';
import { Task } from 'case/models/task-list/task';
import { TaskList } from 'case/models/task-list/taskList';
import * as taskListLocales from 'main/locales/en/taskList.json';

const alert = new Alert('alert heading');

const subTasks = [
  new SubTask('sub task one', '#', TaskStatus.Complete),
  new SubTask('sub task two', '#', TaskStatus.NotStarted),
  new SubTask('sub task three', '#'),
];

const tasks = [
  new Task('task heading', subTasks, 'sectionId', alert),
];

const taskList = new TaskList(tasks);

describe('Task list component', () => {
  describe('Task List', () => {
    it('Should get tasks', () => {
      expect(taskList.tasks.length).to.be.equal(1);
      expect(taskList.tasks).to.be.equal(tasks);
    });
  });

  describe('Task', () => {
    it('Should get heading', () => {
      expect(tasks[0].heading).to.be.equal('task heading');
    });

    it('Should get subTasks', () => {
      expect(tasks[0].subTasks.length).to.be.equal(3);
      expect(tasks[0].subTasks).to.be.equal(subTasks);
    });

    it('Should get sectionId', () => {
      expect(tasks[0].sectionId).to.be.equal('sectionId');
    });

    it('Should get infoAlert', () => {
      expect(tasks[0].infoAlert).to.be.equal(alert);
    });
  });

  describe('Sub Task', () => {
    it('Should get name', () => {
      expect(subTasks[0].name).to.be.equal('sub task one');
    });

    it('Should get url', () => {
      expect(subTasks[0].url).to.be.equal('#');
    });

    it('Should get status', () => {
      expect(subTasks[0].status).to.be.equal(taskListLocales.taskStatus.complete);
    });
  });
});
