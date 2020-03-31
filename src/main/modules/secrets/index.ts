import { get, has, set } from 'lodash';
import * as config from 'config';

const setSecret = (secretPath: string, configPath: string): void => {
  if (has(config, secretPath)) {
    set(config, configPath, get(config, secretPath));
  }
};

export function setup(): void {
  console.log("Config", config);
  if (has(config, 'secrets.adoption')) {
    setSecret('secrets.adoption.AppInsightsInstrumentationKey', 'applicationInsights.instrumentationKey');
    setSecret('secrets.adoption.adoption-idam-client-secret', 'idam.clientSecret');
  }
}
