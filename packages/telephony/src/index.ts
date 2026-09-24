export * from './telephony.provider.js';
export * from './twilio.adapter.js';
export * from './india-sip.adapter.js';
export * from './mock.adapter.js';

import { TelephonyProvider } from './telephony.provider.js';
import { TwilioTelephonyAdapter } from './twilio.adapter.js';
import { IndiaSipTelephonyAdapter } from './india-sip.adapter.js';
import { MockTelephonyAdapter } from './mock.adapter.js';

export class TelephonyFactory {
  static getProvider(providerName: string): TelephonyProvider {
    switch (providerName) {
      case 'twilio':
        return new TwilioTelephonyAdapter();
      case 'india_sip':
      case 'exotel':
        return new IndiaSipTelephonyAdapter();
      case 'mock':
      default:
        return new MockTelephonyAdapter();
    }
  }
}
