export type TelephonyProviderType = 'twilio' | 'india_sip' | 'exotel' | 'mock';

export type CallDirection = 'inbound' | 'outbound';

export type CallStatus =
  | 'initiated'
  | 'queued'
  | 'ringing'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'busy'
  | 'no_answer'
  | 'canceled';

export interface PhoneNumber {
  id: string;
  organizationId: string;
  phoneNumber: string; // E.164
  provider: TelephonyProviderType;
  assignedAgentId?: string;
  friendlyName?: string;
  recordingEnabled: boolean;
  consentAnnouncement: boolean;
  businessHours?: {
    timezone: string;
    schedule: Record<string, { start: string; end: string; enabled: boolean }>;
  };
  fallbackNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboundCallEvent {
  callSid: string;
  from: string;
  to: string;
  provider: TelephonyProviderType;
  rawPayload: Record<string, any>;
  timestamp: string;
}

export interface OutboundCallRequest {
  agentId: string;
  fromPhoneNumber: string;
  toPhoneNumber: string;
  metadata?: Record<string, any>;
}

export interface CallRecord {
  id: string;
  organizationId: string;
  agentId: string;
  phoneNumberId?: string;
  providerCallSid: string;
  direction: CallDirection;
  callerNumber: string;
  destinationNumber: string;
  status: CallStatus;
  startedAt: string;
  answeredAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}
