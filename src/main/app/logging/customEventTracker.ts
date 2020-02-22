import appInsights from 'applicationinsights'
import { Logger } from '@hmcts/nodejs-logging'

export function trackCustomEvent (eventName: string, trackingProperties: {}) {

  const logger = Logger.getLogger('customEventTracker')

  try {
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackEvent({
        name: eventName,
        properties: trackingProperties
      })
    }
  } catch (err) {
    logger.error(err.stack)
  }
}
