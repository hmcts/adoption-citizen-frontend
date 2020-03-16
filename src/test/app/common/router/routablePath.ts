import { expect } from 'chai';
import { RoutablePath } from 'common/router/routablePath';

describe('RoutablePath', () => {
  describe('providing uri', () => {
    it('should strip index from the end of the uri', () => {
      expect(new RoutablePath('/case/index').uri).to.be.equal('/case');
    });
    it('should not strip index from the middle of the uri', () => {
      expect(new RoutablePath('/case/task-list').uri).to.be.equal('/case/task-list');
    });
  });

  describe('finding associated view', () => {
    it('should return path within feature directory structure', () => {
      expect(new RoutablePath('/case/task-list').associatedView).to.be.equal('views/task-list');
      expect(new RoutablePath('/task-list').associatedView).to.be.equal('views/task-list');
    });
  });

  describe('constructor', () => {
    it('should throw error when uri is missing', () => {
      expect(() => new RoutablePath('')).to.throw('uri is missing');
    });
  });
});
