# Integrations & P2D Workforce Event Bus

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  

---

## 1. Generic Integration Connector Framework

The integrations package provides a secure, abstracted HTTP connector framework allowing the platform to interact with any external REST API, CRM, or Webhook destination.

### 1.1 Credential Management
- Supported Authentication Types:
  - `API Key` (Custom Header or Query Param)
  - `Bearer Token` (Authorization: Bearer `<token>`)
  - `Basic Auth` (`username` : `password`)
  - `OAuth2` (Client Credentials Grant & Refresh Tokens)
- All secrets are encrypted in the database with AES-256-GCM.

---

## 2. Standard P2D Workforce Event Model

The P2D Voice AI Agent integrates with the broader **P2D Agent Workforce & Command Center** by emitting structured events:

```json
{
  "event": "conversation.completed",
  "event_id": "evt_01J8K991A88",
  "timestamp": "2026-09-24T12:45:00.000Z",
  "organization_id": "org_p2d_prod",
  "agent": {
    "id": "agent_sales_01",
    "name": "P2D Sales Qualification Agent",
    "version": "1.0.0"
  },
  "call": {
    "id": "call_9921",
    "provider_call_sid": "CA1234567890abcdef",
    "direction": "inbound",
    "duration_seconds": 218,
    "caller_number": "+14155559876",
    "destination_number": "+14155552671"
  },
  "customer": {
    "name": "John Doe",
    "organization": "Acme Corp",
    "phone": "+14155559876",
    "email": "john.doe@acme.com"
  },
  "analysis": {
    "intent": "demo_request",
    "outcome": "qualified_lead",
    "sentiment": "positive",
    "priority": "high",
    "summary": "Customer requested 30-min product demo for 15-person engineering team.",
    "next_best_action": "Send calendar invite and enterprise sales deck."
  },
  "actions": [
    {
      "id": "act_001",
      "type": "schedule_demo",
      "description": "Schedule 30-min demo on Tuesday 2 PM",
      "owner": "sales",
      "due_date": "2026-09-29T14:00:00Z"
    }
  ]
}
```
