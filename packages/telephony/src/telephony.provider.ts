import { InboundCallEvent, CallStatus, TelephonyProviderType } from '@p2d/shared';

export interface TelephonyCallParams {
  to: string;
  from: string;
  agentId: string;
  conversationId: string;
  webhookUrl: string;
  statusCallbackUrl: string;
  recordingEnabled?: boolean;
}

export interface TelephonyCallResponse {
  callSid: string;
  status: CallStatus;
  provider: TelephonyProviderType;
}

export interface TelephonyProvider {
  readonly providerName: TelephonyProviderType;

  initiateCall(params: TelephonyCallParams): Promise<TelephonyCallResponse>;
  hangupCall(callSid: string): Promise<boolean>;
  transferCall(callSid: string, destinationNumber: string): Promise<boolean>;
  parseInboundWebhook(payload: Record<string, any>, headers: Record<string, string>): InboundCallEvent;
  verifyWebhookSignature(url: string, params: Record<string, any>, signature: string): boolean;
  generateTwiMLResponse(streamUrl: string, greetingText?: string, consentAnnouncement?: boolean): string;
}
