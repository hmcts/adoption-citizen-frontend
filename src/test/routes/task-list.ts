import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

// TODO: replace this proper route test
describe('Home page', () => {
  describe('on GET', () => {
    it('should return task list', async () => {
      await request(app)
        .get('/task-list')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
