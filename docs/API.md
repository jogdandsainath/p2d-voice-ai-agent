# API Specification

## Project: P2D Voice AI Agent Platform
**Base URL:** `https://api.voice.p2d.ai/api/v1` (Production) / `http://localhost:4000/api/v1` (Local)  
**Authentication:** Bearer Token (`Authorization: Bearer <JWT>`) or API Key (`X-API-Key: <P2D_API_KEY>`)  
**Format:** JSON (`Content-Type: application/json`)  

---

## 1. Authentication & Organization Endpoints

### `POST /auth/login`
Authenticates a user and returns a JWT access token.
```json
// Request
{
  "email": "admin@p2d.ai",
  "password": "Password123!"
}
// Response 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_99182",
    "email": "admin@p2d.ai",
    "name": "Sainath Jogdand",
    "role": "Admin",
    "organization_id": "org_p2d_prod"
  }
}
```

---

## 2. Agent Management Endpoints

### `GET /agents`
Lists all agents for the current organization.
**Query Parameters:**
- `status` (optional): `Draft` | `Published` | `Paused` | `Archived`
- `search` (optional): search by name or description

### `POST /agents`
Creates a new voice agent.
```json
// Request
{
  "name": "P2D Sales Qualification Agent",
  "description": "Inbound SDR agent to qualify leads and schedule demos",
  "avatar": "https://assets.p2d.ai/avatars/sales-ai.png",
  "system_prompt": "You are the P2D Sales AI assistant. Your goal is to qualify inbound leads politely and schedule a demo.",
  "personality": "Professional, articulate, helpful, and concise",
  "voice_provider": "elevenlabs",
  "voice_id": "21m00Tcm4TlvDq8ikWAM",
  "language": "en-US",
  "model_provider": "openai",
  "model_name": "gpt-4o",
  "temperature": 0.4
}
```

### `GET /agents/:id`
Retrieves a specific agent and its active configuration.

### `PATCH /agents/:id`
Updates an agent's working draft configuration.

### `POST /agents/:id/publish`
Publishes the agent draft to create an immutable version snapshot.
```json
// Response 200 OK
{
  "agent_id": "agent_sales_01",
  "status": "Published",
  "published_version": "1.0.0",
  "published_at": "2026-09-24T12:00:00Z"
}
```

### `DELETE /agents/:id`
Archives an agent.

---

## 3. Telephony & Calling Endpoints

### `GET /phone-numbers`
Lists all provisioned phone numbers.

### `POST /phone-numbers`
Provisions or connects a new phone number.
```json
// Request
{
  "phone_number": "+14155552671",
  "provider": "twilio",
  "assigned_agent_id": "agent_sales_01",
  "recording_enabled": true,
  "consent_announcement": true
}
```

### `POST /calls/outbound`
Initiates a programmable outbound call.
```json
// Request
{
  "agent_id": "agent_sales_01",
  "from_phone_number": "+14155552671",
  "to_phone_number": "+14155559876",
  "metadata": {
    "lead_id": "lead_9921",
    "customer_name": "John Doe",
    "company": "Acme Corp"
  }
}
// Response 201 Created
{
  "call_id": "call_out_88291",
  "conversation_id": "conv_99281",
  "status": "initiated",
  "direction": "outbound",
  "created_at": "2026-09-24T12:30:00Z"
}
```

### `GET /calls/:id`
Retrieves live status and metadata for a specific call.

---

## 4. Conversations & Intelligence Endpoints

### `GET /conversations`
Lists conversations with pagination and filtering by agent, date, intent, and outcome.

### `GET /conversations/:id`
Retrieves full conversation details including metadata and duration.

### `GET /conversations/:id/transcript`
Retrieves chronological, speaker-diarized transcript messages.
```json
// Response 200 OK
{
  "conversation_id": "conv_99281",
  "messages": [
    {
      "id": "msg_001",
      "speaker": "agent",
      "text": "Hello, thank you for calling Pur2Divin. How can I assist you today?",
      "start_time": 0.5,
      "end_time": 3.8
    },
    {
      "id": "msg_002",
      "speaker": "customer",
      "text": "Hi, I would like to schedule a product demo for our engineering team.",
      "start_time": 4.2,
      "end_time": 8.1
    }
  ]
}
```

### `GET /conversations/:id/analysis`
Retrieves post-call structured intelligence.
```json
// Response 200 OK
{
  "conversation_id": "conv_99281",
  "intent": "demo_request",
  "outcome": "qualified_lead",
  "sentiment": "positive",
  "priority": "high",
  "customer_name": "John Doe",
  "organization": "Acme Corp",
  "phone": "+14155559876",
  "email": "john.doe@acme.com",
  "summary": "Customer expressed interest in deploying P2D voice AI agents for their sales team. Requested a 30-minute product demo next Tuesday.",
  "topics": ["voice AI", "demo", "pricing", "sales automation"],
  "objections": ["timeline for deployment"],
  "commitments": ["Agent committed to sending calendar invitation for Tuesday at 2 PM PST."],
  "next_best_action": "Send calendar invite and prepare enterprise pricing overview."
}
```

### `GET /conversations/:id/actions`
Retrieves extracted action items.
```json
// Response 200 OK
{
  "actions": [
    {
      "id": "act_101",
      "action_type": "schedule_demo",
      "description": "Schedule 30-min demo for Acme Corp on Tuesday 2 PM",
      "owner": "sales",
      "due_date": "2026-09-29T14:00:00Z",
      "status": "Detected",
      "confidence": 0.98
    }
  ]
}
```

---

## 5. Workflows & Automations Endpoints

### `GET /workflows`
Lists all visual automation workflows.

### `POST /workflows`
Creates a new workflow graph.
```json
// Request
{
  "name": "Post-Call Sales Qualification Workflow",
  "trigger_type": "Call Completed",
  "is_active": true,
  "nodes": [
    {
      "id": "node_1",
      "type": "Trigger",
      "config": { "event": "call.completed" }
    },
    {
      "id": "node_2",
      "type": "Condition",
      "config": { "expression": "analysis.intent == 'demo_request'" }
    },
    {
      "id": "node_3",
      "type": "Webhook",
      "config": {
        "url": "https://api.p2d.ai/v1/leads/sync",
        "method": "POST",
        "payload_template": "{\"name\": \"{{analysis.customer_name}}\", \"company\": \"{{analysis.organization}}\", \"phone\": \"{{analysis.phone}}\"}"
      }
    }
  ],
  "edges": [
    { "source": "node_1", "target": "node_2" },
    { "source": "node_2", "target": "node_3", "condition_value": "true" }
  ]
}
```

### `POST /workflows/:id/execute`
Manually triggers a workflow execution with a specified conversation payload.

### `GET /workflows/:id/executions`
Retrieves execution run history and step logs.

---

## 6. Integrations Endpoints

### `GET /integrations`
Lists connected integrations and status.

### `POST /integrations`
Registers a new integration connector.
```json
// Request
{
  "provider": "webhook",
  "name": "HubSpot Lead Sync Webhook",
  "base_url": "https://api.hubapi.com",
  "auth_type": "bearer",
  "credentials": {
    "token": "pat-na1-12345678-abcd-..."
  }
}
```

---

## 7. Webhooks & Telephony Ingress

### `POST /telephony/inbound`
Idempotent webhook invoked by telephony providers (e.g. Twilio) on inbound calls. Returns TwiML or provider-specific instruction to connect the WebSocket media stream.

### `POST /telephony/status`
Webhook invoked on call status changes (`ringing`, `answered`, `completed`, `failed`).

### `POST /telephony/recording`
Webhook invoked when audio recording is finalized.
