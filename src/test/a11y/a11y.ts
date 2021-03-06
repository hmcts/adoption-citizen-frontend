import { fail } from 'assert';
import { app } from 'main/app';
import { Paths } from 'case/paths';
import { RoutablePath } from 'common/router/routablePath';

import config from 'config';

import * as supertest from 'supertest';
import 'test/a11y/mocks';

app.locals.csrf = 'dummy-token';

const pa11y = require('pa11y');
const agent = supertest.agent(app);
const cookieName: string = config.get<string>('session.cookieName');

class Pa11yResult {
  documentTitle: string
  pageUrl: string
  issues: PallyIssue[]
}

class PallyIssue {
  code: string
  context: string
  message: string
  selector: string
  type: string
  typeCode: number
}

function ensurePageCallWillSucceed (url: string): Promise<void> {
  return agent.get(url)
    .set('Cookie', `${cookieName}=token`)
    .then((res: supertest.Response) => {
      if (res.redirect) {
        throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
      }
      if (res.serverError) {
        throw new Error(`Call to ${url} resulted in internal server error`);
      }
    });
}

function expectNoErrors (messages: PallyIssue[]): void {
  const errors = messages.filter((m) => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

// GOV UK template has semantic issues in two branding imagery. Disabling for now.
function runPally(url: string): Pa11yResult {
  return pa11y(url, {
    headers: {
      Cookie: `${cookieName}=token`,
    },
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
  });
}

function testAccessibility (paths: Paths): void {

  Object.values(paths).forEach((path: RoutablePath) => {
    const url = path.uri;
    describe(`Page ${url}`, () => {

      it('should have no accessibility errors', (done) => {
        ensurePageCallWillSucceed(url)
          .then(() => runPally(agent.get(url).url))
          .then((result: Pa11yResult) => {
            expectNoErrors(result.issues);
            done();
          })
          .catch((err) => done(err));
      });
    });
  });
}

describe('Accessibility', () => {
  testAccessibility(Paths);
});

