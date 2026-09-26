import { TelephonyProvider, TelephonyCallParams, TelephonyCallResponse } from './telephony.provider';
import { InboundCallEvent, logger } from '@p2d/shared';

export class MockTelephonyAdapter implements TelephonyProvider {
  public readonly providerName = 'mock' as const;

  async initiateCall(params: TelephonyCallParams): Promise<TelephonyCallResponse> {
    logger.info('[Simulator] Outbound call initiated', { to: params.to, from: params.from });
    return {
      callSid: `SIM_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'initiated',
      provider: 'mock',
    };
  }

  async hangupCall(callSid: string): Promise<boolean> {
    logger.info('[Simulator] Call hung up', { callSid });
    return true;
  }

  async transferCall(callSid: string, destinationNumber: string): Promise<boolean> {
    logger.info('[Simulator] Call transfer simulated', { callSid, destinationNumber });
    return true;
  }

  parseInboundWebhook(payload: Record<string, any>, headers: Record<string, string>): InboundCallEvent {
    return {
      callSid: payload.callSid || `SIM_IN_${Date.now()}`,
      from: payload.from || '+14155559876',
      to: payload.to || '+14155552671',
      provider: 'mock',
      rawPayload: payload,
      timestamp: new Date().toISOString(),
    };
  }

  verifyWebhookSignature(url: string, params: Record<string, any>, signature: string): boolean {
    return true;
  }

  generateTwiMLResponse(streamUrl: string, greetingText?: string, consentAnnouncement = true): string {
    return JSON.stringify({
      mode: 'simulator',
      streamUrl,
      greetingText,
      consentAnnouncement,
    });
  }
}
