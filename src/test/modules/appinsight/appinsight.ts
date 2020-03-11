import sinon from 'sinon';
import config from 'config';
import * as appInsights from 'applicationinsights';
import * as chai from 'chai';
import * as appInsightConfig from '../../../main/modules/appinisght';
import sinonChai from 'sinon-chai';
import { remove, set } from 'lodash';

const APP_INSIGHT_IKEY_CONFIG_PATH = 'applicationInsights.instrumentationKey';
const APP_INSIGHT_IKEY = '1';

chai.use(sinonChai);

describe('application insight setup', () => {
  let configuration;
  let sandbox;

  beforeEach(() => {
    configuration = Object.create(config);
    sandbox = sinon.createSandbox();
    sandbox.spy(appInsights, 'setup');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should be run when application insight configuration present', () => {
    set(configuration, APP_INSIGHT_IKEY_CONFIG_PATH, APP_INSIGHT_IKEY);

    appInsightConfig.setup(configuration);

    chai.expect(appInsights.setup).to.have.been.calledWith(APP_INSIGHT_IKEY);
  });

  it('should not be run when application insight configuration absent', () => {
    remove(configuration, APP_INSIGHT_IKEY_CONFIG_PATH);

    appInsightConfig.setup(configuration);

    chai.expect(appInsights.setup).not.to.have.been.called;
  });
});
