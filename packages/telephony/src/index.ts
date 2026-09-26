export * from './telephony.provider.js';
export * from './twilio.adapter.js';
export * from './india-sip.adapter.js';
export * from './plivo.adapter.js';
export * from './mock.adapter.js';

import { TelephonyProvider } from './telephony.provider.js';
import { TwilioTelephonyAdapter } from './twilio.adapter.js';
import { IndiaSipTelephonyAdapter } from './india-sip.adapter.js';
import { PlivoTelephonyAdapter } from './plivo.adapter.js';
import { MockTelephonyAdapter } from './mock.adapter.js';

export class TelephonyFactory {
  static getProvider(providerName = 'twilio'): TelephonyProvider {
    switch (providerName.toLowerCase()) {
      case 'twilio':
        return new TwilioTelephonyAdapter();
      case 'india_sip':
      case 'exotel':
      case 'knowlarity':
        return new IndiaSipTelephonyAdapter();
      case 'plivo':
        return new PlivoTelephonyAdapter();
      case 'mock':
      default:
        return new MockTelephonyAdapter();
    }
  }
}
