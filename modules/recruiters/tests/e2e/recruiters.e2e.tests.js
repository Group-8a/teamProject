'use strict';

describe('Recruiters E2E Tests:', function () {
  describe('Test Recruiters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/recruiters');
      expect(element.all(by.repeater('recruiter in recruiters')).count()).toEqual(0);
    });
  });
});
