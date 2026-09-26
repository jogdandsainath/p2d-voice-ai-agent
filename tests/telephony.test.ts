import { describe, it, expect } from 'vitest';
import {
  TelephonyFactory,
  TwilioTelephonyAdapter,
  IndiaSipTelephonyAdapter,
  MockTelephonyAdapter,
} from '../packages/telephony/src/index';

describe('Telephony Provider Abstraction & Adapters', () => {
  it('should instantiate appropriate provider via factory', () => {
    const twilio = TelephonyFactory.getProvider('twilio');
    expect(twilio.providerName).toBe('twilio');

    const indiaSip = TelephonyFactory.getProvider('india_sip');
    expect(indiaSip.providerName).toBe('india_sip');

    const mock = TelephonyFactory.getProvider('mock');
    expect(mock.providerName).toBe('mock');
  });

  it('Twilio adapter should parse inbound webhooks and generate TwiML', () => {
    const twilio = new TwilioTelephonyAdapter();
    const event = twilio.parseInboundWebhook(
      { CallSid: 'CA12345', From: '+14155559876', To: '+14155552671' },
      {}
    );

    expect(event.callSid).toBe('CA12345');
    expect(event.from).toBe('+14155559876');

    const twiml = twilio.generateTwiMLResponse('wss://api.voice.p2d.ai/media', 'Welcome');
    expect(twiml).toContain('<Response>');
    expect(twiml).toContain('<Stream url="wss://api.voice.p2d.ai/media">');
  });

  it('India SIP adapter should support TRAI/DoT compliance routing', async () => {
    const indiaSip = new IndiaSipTelephonyAdapter();
    const resp = await indiaSip.initiateCall({
      to: '+919876543210',
      from: '+918012345678',
      agentId: 'agent_01',
      conversationId: 'conv_01',
      webhookUrl: 'http://localhost/inbound',
      statusCallbackUrl: 'http://localhost/status',
    });

    expect(resp.callSid).toContain('IN_SIP');
    expect(resp.provider).toBe('india_sip');
  });
});
