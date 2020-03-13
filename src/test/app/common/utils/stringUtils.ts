import { expect } from 'chai';
import { StringUtils } from 'common/utils/stringUtils';

describe('StringUtils', () => {
  describe('isBlank', () => {
    it('should return true when value is null', () => {
      expect(StringUtils.isBlank('')).to.be.true;
    });

    it('should return true when value is undefined', () => {
      expect(StringUtils.isBlank(undefined)).to.be.true;
    });

    it('should return false when value is a space', () => {
      expect(StringUtils.isBlank(' ')).to.be.false;
    });
  });
});

