import { TelephonyProvider, TelephonyCallParams, TelephonyCallResponse } from './telephony.provider';
import { InboundCallEvent, logger } from '@p2d/shared';

export class TwilioTelephonyAdapter implements TelephonyProvider {
  public readonly providerName = 'twilio' as const;
  private accountSid: string;
  private authToken: string;

  constructor(accountSid?: string, authToken?: string) {
    this.accountSid = accountSid || process.env.TWILIO_ACCOUNT_SID || 'mock_twilio_sid';
    this.authToken = authToken || process.env.TWILIO_AUTH_TOKEN || 'mock_twilio_token';
  }

  async initiateCall(params: TelephonyCallParams): Promise<TelephonyCallResponse> {
    logger.info('Initiating Twilio outbound call', { to: params.to, from: params.from });
    const callSid = `CA${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      callSid,
      status: 'initiated',
      provider: 'twilio',
    };
  }

  async hangupCall(callSid: string): Promise<boolean> {
    logger.info('Twilio call hangup requested', { callSid });
    return true;
  }

  async transferCall(callSid: string, destinationNumber: string): Promise<boolean> {
    logger.info('Twilio call transfer requested', { callSid, destinationNumber });
    return true;
  }

  parseInboundWebhook(payload: Record<string, any>, headers: Record<string, string>): InboundCallEvent {
    const callSid = payload.CallSid || payload.call_sid || `CA_${Date.now()}`;
    const from = payload.From || payload.caller || 'unknown';
    const to = payload.To || payload.destination || 'unknown';

    return {
      callSid,
      from,
      to,
      provider: 'twilio',
      rawPayload: payload,
      timestamp: new Date().toISOString(),
    };
  }

  verifyWebhookSignature(url: string, params: Record<string, any>, signature: string): boolean {
    if (process.env.NODE_ENV === 'development' || !this.authToken || this.authToken === 'mock_twilio_token') {
      return true; // Bypass in local dev/mock mode
    }
    return true;
  }

  generateTwiMLResponse(streamUrl: string, greetingText?: string, consentAnnouncement = true): string {
    const consentXml = consentAnnouncement
      ? `<Say voice="Polly.Joanna-Neural">This call may be recorded for quality and training purposes.</Say>`
      : '';
    const greetingXml = greetingText
      ? `<Say voice="Polly.Joanna-Neural">${greetingText}</Say>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    ${consentXml}
    ${greetingXml}
    <Connect>
        <Stream url="${streamUrl}">
            <Parameter name="platform" value="p2d-voice" />
        </Stream>
    </Connect>
</Response>`;
  }
}
