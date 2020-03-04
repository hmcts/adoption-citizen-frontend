import config from 'config';
import {expect} from 'chai';
import * as secrets from '../../../main/modules/secrets';
import { set, remove} from 'lodash';

const APP_INSIGHT_IKEY_CONFIG_PATH = 'secrets.adoption.AppInsightsInstrumentationKey';
const APP_INSIGHT_IKEY = '1';

describe('application insight setup', () => {
  let configuration;

  beforeEach(() => {
    configuration = Object.create(config);
  });

  it('should add application insight secrets to config', () => {

    set(configuration, APP_INSIGHT_IKEY_CONFIG_PATH, APP_INSIGHT_IKEY);

    secrets.setup(configuration);

    expect(configuration.applicationInsights.instrumentationKey).to.equal(APP_INSIGHT_IKEY);
  });

  it('should not add application insight secrets to config if secrets is absent', () => {
    remove(configuration, APP_INSIGHT_IKEY_CONFIG_PATH);

    secrets.setup(configuration);

    expect(configuration.applicationInsights).to.be.undefined;
  });

});
