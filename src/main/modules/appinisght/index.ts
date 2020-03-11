import * as appInsights from 'applicationinsights';
import {IConfig} from 'config';

import {Logger} from '@hmcts/nodejs-logging';

export function setup(config: IConfig): void {

  if (config.has('applicationInsights.instrumentationKey')) {
    appInsights.setup(config.get('applicationInsights.instrumentationKey'))
      .setAutoCollectConsole(true, true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .setSendLiveMetrics(true)
      .start();
    Logger.getLogger('server')
      .info('Application insight configured with ' + config.get('applicationInsights.instrumentationKey'));
  }
}
