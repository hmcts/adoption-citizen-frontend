import { expect } from 'chai';
import { Alert } from '../../../../../main/app/case/types';

describe('Alert', () => {
  it('should get content prop', () => {
    const alert = new Alert('Test alert');
    expect(alert.content).to.be.equal('Test alert');
  });
});
