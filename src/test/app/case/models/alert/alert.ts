import { expect } from 'chai';
import { Alert } from 'case/models/alert/alert';

describe('Alert', () => {
  it('should get content prop', () => {
    const alert = new Alert('Test alert');
    expect(alert.content).to.be.equal('Test alert');
  });
});
