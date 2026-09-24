# Workflow Builder & Execution Engine

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  

---

## 1. Graph Data Model & Nodes

Workflows are represented as directed acyclic graphs (DAG) composed of `WorkflowNode` and `WorkflowEdge` definitions:

```json
{
  "workflow_id": "wf_demo_followup",
  "name": "Sales Demo Follow-up Automation",
  "trigger_type": "Call Completed",
  "nodes": [
    {
      "id": "node_trigger",
      "type": "Trigger",
      "config": { "event": "call.completed" }
    },
    {
      "id": "node_check_intent",
      "type": "Condition",
      "config": {
        "expression": "context.analysis.intent == 'demo_request' && context.analysis.outcome == 'qualified_lead'"
      }
    },
    {
      "id": "node_create_crm_lead",
      "type": "CRM",
      "config": {
        "action": "create_lead",
        "lead_data": {
          "name": "{{context.analysis.customer_name}}",
          "company": "{{context.analysis.organization}}",
          "phone": "{{context.analysis.phone}}",
          "email": "{{context.analysis.email}}",
          "notes": "{{context.analysis.summary}}"
        }
      }
    },
    {
      "id": "node_send_webhook",
      "type": "Webhook",
      "config": {
        "url": "https://hooks.zapier.com/hooks/catch/123/abc",
        "method": "POST",
        "headers": { "Content-Type": "application/json" },
        "body_template": "{\"event\":\"lead_qualified\",\"summary\":\"{{context.analysis.summary}}\"}"
      }
    }
  ],
  "edges": [
    { "source": "node_trigger", "target": "node_check_intent" },
    { "source": "node_check_intent", "target": "node_create_crm_lead", "condition_value": "true" },
    { "source": "node_create_crm_lead", "target": "node_send_webhook" }
  ]
}
```

---

## 2. Graph Execution Algorithm
1. **Trigger Phase:** Worker receives event payload (`call.completed`, `transcript.created`, `action.detected`).
2. **Context Compilation:** Hydrates context object containing `call`, `conversation`, `transcript`, `analysis`, and `actions`.
3. **Topological Traversal:**
   - Evaluates nodes starting from the Trigger node.
   - For `Condition` nodes, evaluates JavaScript / JSONPath boolean expressions against context.
   - Evaluates matching downstream branches; skipped branches log `SKIPPED` status.
   - For `Action` nodes (Webhook, Email, SMS, CRM, API), dispatches asynchronous task with automatic 3x exponential backoff retry.
4. **Execution Log Persistence:** Writes detailed input/output step telemetry to `workflow_execution_steps` for auditing.
