import { expect } from 'chai';
import { app } from '../../main/app';

import request from 'supertest';

describe('Home page', () => {
  describe('on GET', () => {
    it('should return sample home page', async () => {
      await request(app)
        .get('/')
        .expect((res) => expect(res.status).to.equal(302));
    });
  });
});
