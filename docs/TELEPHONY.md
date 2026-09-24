# Telephony Architecture & Provider Abstraction

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  
**Scope:** Telephony Gateway, Carrier Adapters, India PSTN/SIP Compliance  

---

## 1. The `TelephonyProvider` Interface

The platform abstracts all carrier interactions behind a standard TypeScript interface:

```typescript
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
  status: 'initiated' | 'queued' | 'ringing' | 'in_progress';
  provider: string;
}

export interface TelephonyProvider {
  readonly providerName: string;
  
  initiateCall(params: TelephonyCallParams): Promise<TelephonyCallResponse>;
  hangupCall(callSid: string): Promise<boolean>;
  transferCall(callSid: string, destinationNumber: string): Promise<boolean>;
  parseInboundWebhook(payload: Record<string, any>, headers: Record<string, string>): InboundCallEvent;
  verifyWebhookSignature(url: string, params: Record<string, any>, signature: string): boolean;
  generateTwiMLResponse(streamUrl: string, greetingText?: string, consentAnnouncement?: boolean): string;
}
```

---

## 2. Adapter Implementations

### 2.1 Twilio Telephony Adapter (`TwilioTelephonyAdapter`)
- Full bidirectional audio streaming via Twilio Voice `<Connect><Stream url="wss://..."/></Connect>`.
- Inbound and outbound call initiation, status webhooks, call recording callbacks, and live DTMF detection.
- Webhook signature verification via `twilio.validateRequest`.

### 2.2 India PSTN / Telecom Compliance Architecture (`IndiaSipTelephonyAdapter`)
- **Regulatory Landscape (DoT / TRAI / OSP Regulations):**
  - Indian telecom regulations restrict toll-bypass and interconnection between private IP networks and Indian PSTN (`+91` numbers).
  - Outbound commercial voice communications require registration on the DLT (Distributed Ledger Technology) framework for commercial scrubbing.
  - Call routing must comply with OSP (Other Service Provider) routing guidelines requiring localized PSTN termination via licensed Indian Telecom Service Providers (TSPs) like Tata Tele, Airtel Business, Reliance Jio, or licensed cloud telephony platforms such as **Exotel** and **Knowlarity**.
- **Architecture Strategy:**
  - `TelephonyProvider` abstraction decouples P2D Voice Engine from global carrier protocols.
  - The `IndiaSipTelephonyAdapter` supports direct SIP trunking to licensed Indian SBCs (Session Border Controllers) with G.711 / Opus codecs or REST API integration with Exotel / Knowlarity for India-domestic PSTN calls.
  - WebRTC media endpoints terminate at edge voice relays deployed within Indian cloud regions (e.g. AWS `ap-south-1` / GCP `asia-south1`) to satisfy latency and data residency standards.

### 2.3 Simulator Telephony Adapter (`MockTelephonyAdapter`)
- Local development and CI testing adapter allowing simulated inbound/outbound calls without carrier accounts or telecom fees.
- Simulates call states (`initiated`, `ringing`, `answered`, `completed`) and streams mock audio frames.
