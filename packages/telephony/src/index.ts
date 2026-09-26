export * from './telephony.provider';
export * from './twilio.adapter';
export * from './india-sip.adapter';
export * from './plivo.adapter';
export * from './mock.adapter';

import { TelephonyProvider } from './telephony.provider';
import { TwilioTelephonyAdapter } from './twilio.adapter';
import { IndiaSipTelephonyAdapter } from './india-sip.adapter';
import { PlivoTelephonyAdapter } from './plivo.adapter';
import { MockTelephonyAdapter } from './mock.adapter';

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
