import * as propertiesVolume from '@hmcts/properties-volume';
import { get, has, set } from 'lodash';
import { IConfig } from 'config';

const setSecret = (config: IConfig, secretPath: string, configPath: string): void => {
  if (has(config,secretPath)) {
    set(config, configPath, get(config, secretPath));
  }
};

export function setup(config: IConfig): void {
  propertiesVolume.addTo(config);
  console.log("Config", config);
  if (has(config,'secrets.adoption')) {
    setSecret(config, 'secrets.adoption.AppInsightsInstrumentationKey', 'applicationInsights.instrumentationKey');
    setSecret(config, 'secrets.adoption.adoption-idam-client-secret', 'idam.clientSecret');
  }
  console.log("After setting secrets", config);
}
