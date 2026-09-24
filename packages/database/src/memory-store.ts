import {
  Agent,
  AgentVersion,
  PhoneNumber,
  CallRecord,
  Conversation,
  TranscriptMessage,
  ConversationAnalysis,
  ActionItem,
  Workflow,
  WorkflowExecution,
  WorkflowExecutionStep,
  Integration,
  User,
  Organization,
  NotFoundError,
} from '@p2d/shared';

export class MemoryStore {
  public organizations: Map<string, Organization> = new Map();
  public users: Map<string, User & { passwordHash: string }> = new Map();
  public agents: Map<string, Agent> = new Map();
  public agentVersions: Map<string, AgentVersion> = new Map();
  public phoneNumbers: Map<string, PhoneNumber> = new Map();
  public calls: Map<string, CallRecord> = new Map();
  public conversations: Map<string, Conversation> = new Map();
  public messages: Map<string, TranscriptMessage[]> = new Map(); // key: conversationId
  public analyses: Map<string, ConversationAnalysis> = new Map(); // key: conversationId
  public actions: Map<string, ActionItem[]> = new Map(); // key: conversationId
  public workflows: Map<string, Workflow> = new Map();
  public workflowExecutions: Map<string, WorkflowExecution> = new Map();
  public integrations: Map<string, Integration> = new Map();
  public credentials: Map<string, { encryptedData: string; iv: string; authTag: string }> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  public seedDefaultData(): void {
    const orgId = 'org_p2d_prod';
    const org: Organization = {
      id: orgId,
      name: 'Pur2Divin Enterprise',
      slug: 'pur2divin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.organizations.set(orgId, org);

    const user: User & { passwordHash: string } = {
      id: 'usr_admin_01',
      organizationId: orgId,
      email: 'admin@p2d.ai',
      name: 'Sainath Jogdand',
      role: 'Admin',
      passwordHash: 'Password123!', // Demo hash
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);

    // Default Inbound Sales Agent
    const salesAgentId = 'agent_sales_01';
    const salesAgent: Agent = {
      id: salesAgentId,
      organizationId: orgId,
      name: 'P2D Sales Qualification Agent',
      description: 'Inbound SDR agent to qualify enterprise prospects and schedule product demos',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Published',
      publishedVersionId: 'ver_sales_100',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.agents.set(salesAgentId, salesAgent);

    const salesVersion: AgentVersion = {
      id: 'ver_sales_100',
      agentId: salesAgentId,
      versionNumber: '1.0.0',
      systemPrompt: `You are the P2D Sales AI assistant representing Pur2Divin. Your objective is to warmly greet the caller, understand their business needs, qualify whether they have an active voice AI or agent workforce requirement, collect their name and company, and offer to schedule a 30-minute product demonstration with our solution architecture team. Be concise, polite, and professional.`,
      personality: 'Professional, consultative, engaging, articulate',
      voiceConfig: {
        provider: 'elevenlabs',
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
        voiceName: 'Rachel (Enterprise SDR)',
        language: 'en-US',
        stability: 0.75,
        similarityBoost: 0.8,
        speed: 1.0,
      },
      modelConfig: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.4,
      },
      tools: [
        {
          id: 'tool_check_calendar',
          name: 'check_calendar_availability',
          description: 'Check available slots for demo booking',
          parameters: {
            type: 'object',
            properties: {
              date: { type: 'string', description: 'Desired booking date (YYYY-MM-DD)' },
            },
            required: ['date'],
          },
        },
      ],
      guardrails: {
        topicRestrictions: ['politics', 'cryptocurrency investment', 'competitor disparagement'],
        sensitiveDataMasking: true,
      },
      createdBy: user.id,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    };
    this.agentVersions.set(salesVersion.id, salesVersion);

    // Default Outbound Follow-up Agent
    const outboundAgentId = 'agent_outbound_01';
    const outboundAgent: Agent = {
      id: outboundAgentId,
      organizationId: orgId,
      name: 'P2D Outbound Lead Follow-up Agent',
      description: 'Conducts proactive follow-up calls to newly registered platform leads',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Published',
      publishedVersionId: 'ver_outbound_100',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.agents.set(outboundAgentId, outboundAgent);

    const outboundVersion: AgentVersion = {
      id: 'ver_outbound_100',
      agentId: outboundAgentId,
      versionNumber: '1.0.0',
      systemPrompt: `You are reaching out on behalf of P2D following up on the lead's recent platform inquiry. Confirm if they have 2 minutes to chat, explain our voice AI capabilities, answer questions, and classify their interest level (Interested, Callback Needed, Not Interested).`,
      personality: 'Enthusiastic, courteous, solution-oriented',
      voiceConfig: {
        provider: 'elevenlabs',
        voiceId: 'AZnzlk1XvdvUeBnXmlld', // Domi
        voiceName: 'Domi (Outbound Specialist)',
        language: 'en-US',
        stability: 0.7,
        similarityBoost: 0.85,
        speed: 1.05,
      },
      modelConfig: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.5,
      },
      tools: [],
      guardrails: {},
      createdBy: user.id,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
    this.agentVersions.set(outboundVersion.id, outboundVersion);

    // Phone Numbers
    const phone1: PhoneNumber = {
      id: 'phone_01',
      organizationId: orgId,
      phoneNumber: '+14155552671',
      provider: 'twilio',
      assignedAgentId: salesAgentId,
      friendlyName: 'US Primary Inbound Line',
      recordingEnabled: true,
      consentAnnouncement: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.phoneNumbers.set(phone1.id, phone1);

    const phone2: PhoneNumber = {
      id: 'phone_02',
      organizationId: orgId,
      phoneNumber: '+919876543210',
      provider: 'india_sip',
      assignedAgentId: salesAgentId,
      friendlyName: 'India Direct Gateway (SIP/PSTN)',
      recordingEnabled: true,
      consentAnnouncement: true,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.phoneNumbers.set(phone2.id, phone2);

    // Default Visual Post-Call Workflow
    const workflowId = 'wf_sales_qualification_01';
    const workflow: Workflow = {
      id: workflowId,
      organizationId: orgId,
      name: 'Post-Call Sales Qualification & CRM Dispatch',
      description: 'Automatically syncs qualified demo leads to CRM and dispatches webhook to P2D Command Center',
      triggerType: 'Call Completed',
      isActive: true,
      nodes: [
        {
          id: 'node_1',
          type: 'Trigger',
          name: 'Call Completed Event',
          config: { event: 'call.completed' },
          position: { x: 100, y: 150 },
        },
        {
          id: 'node_2',
          type: 'Condition',
          name: 'Check Qualified Intent',
          config: { expression: "analysis.intent == 'demo_request'" },
          position: { x: 350, y: 150 },
        },
        {
          id: 'node_3',
          type: 'CRM',
          name: 'Create CRM Lead',
          config: {
            leadName: '{{analysis.customerName}}',
            company: '{{analysis.organization}}',
            phone: '{{analysis.phone}}',
            email: '{{analysis.email}}',
          },
          position: { x: 600, y: 80 },
        },
        {
          id: 'node_4',
          type: 'Webhook',
          name: 'Dispatch P2D Command Center Webhook',
          config: {
            url: 'https://api.p2d.ai/v1/workforce/leads/inbound',
            method: 'POST',
            bodyTemplate: JSON.stringify({
              event: 'lead.qualified',
              customer: '{{analysis.customerName}}',
              company: '{{analysis.organization}}',
              summary: '{{analysis.summary}}',
              nextBestAction: '{{analysis.nextBestAction}}',
            }),
          },
          position: { x: 850, y: 80 },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'node_1', target: 'node_2' },
        { id: 'e2-3', source: 'node_2', target: 'node_3', conditionValue: 'true' },
        { id: 'e3-4', source: 'node_3', target: 'node_4' },
      ],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.workflows.set(workflowId, workflow);

    // Integrations
    const integration1: Integration = {
      id: 'int_p2d_cc',
      organizationId: orgId,
      name: 'P2D Command Center Event Webhook',
      provider: 'p2d_command_center',
      baseUrl: 'https://api.p2d.ai/v1',
      authType: 'bearer',
      isActive: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.integrations.set(integration1.id, integration1);

    // Seed a completed demo conversation
    const sampleCallId = 'call_demo_01';
    const sampleConvId = 'conv_demo_01';
    const sampleCall: CallRecord = {
      id: sampleCallId,
      organizationId: orgId,
      agentId: salesAgentId,
      phoneNumberId: phone1.id,
      providerCallSid: 'CA_SAMPLE_1234567890',
      direction: 'inbound',
      callerNumber: '+14155559876',
      destinationNumber: '+14155552671',
      status: 'completed',
      startedAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
      answeredAt: new Date(Date.now() - 1000 * (3600 * 2 - 2)).toISOString(),
      endedAt: new Date(Date.now() - 1000 * (3600 * 2 - 180)).toISOString(),
      durationSeconds: 178,
      recordingUrl: 'https://assets.p2d.ai/recordings/sample-call-01.mp3',
      createdAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * (3600 * 2 - 180)).toISOString(),
    };
    this.calls.set(sampleCallId, sampleCall);

    const sampleConv: Conversation = {
      id: sampleConvId,
      organizationId: orgId,
      callId: sampleCallId,
      agentId: salesAgentId,
      sessionState: 'COMPLETED',
      createdAt: sampleCall.startedAt,
      updatedAt: sampleCall.endedAt || sampleCall.startedAt,
    };
    this.conversations.set(sampleConvId, sampleConv);

    const sampleMessages: TranscriptMessage[] = [
      {
        id: 'msg_01',
        conversationId: sampleConvId,
        speaker: 'agent',
        text: 'Hello, thank you for calling Pur2Divin! My name is Rachel. How can I assist you today?',
        startTime: 0.5,
        endTime: 4.8,
        createdAt: sampleCall.startedAt,
      },
      {
        id: 'msg_02',
        conversationId: sampleConvId,
        speaker: 'customer',
        text: 'Hi Rachel! I am Vikram from Apex Logistics. We are looking to automate our inbound delivery dispatch with AI voice agents.',
        startTime: 5.2,
        endTime: 12.4,
        createdAt: sampleCall.startedAt,
      },
      {
        id: 'msg_03',
        conversationId: sampleConvId,
        speaker: 'agent',
        text: 'That sounds like a great fit, Vikram! Our P2D Voice AI platform integrates directly with dispatch workflows and CRMs. Would you like to schedule a 30-minute demonstration next Tuesday?',
        startTime: 13.0,
        endTime: 21.5,
        createdAt: sampleCall.startedAt,
      },
      {
        id: 'msg_04',
        conversationId: sampleConvId,
        speaker: 'customer',
        text: 'Yes, Tuesday at 2 PM IST works perfectly for me and our operations head. Please send the invite to vikram@apexlogistics.in.',
        startTime: 22.0,
        endTime: 28.5,
        createdAt: sampleCall.startedAt,
      },
      {
        id: 'msg_05',
        conversationId: sampleConvId,
        speaker: 'agent',
        text: 'Excellent! I have noted Tuesday at 2 PM IST for you and your team. We will send the calendar invite and details to vikram@apexlogistics.in right away. Have a wonderful day!',
        startTime: 29.0,
        endTime: 36.2,
        createdAt: sampleCall.startedAt,
      },
    ];
    this.messages.set(sampleConvId, sampleMessages);

    const sampleAnalysis: ConversationAnalysis = {
      id: 'analysis_01',
      conversationId: sampleConvId,
      summary: 'Caller Vikram from Apex Logistics inquired about automating delivery dispatch using P2D Voice AI. Qualified as high-priority lead and scheduled a 30-minute demonstration for next Tuesday at 2 PM IST.',
      intent: 'demo_request',
      secondaryIntents: ['pricing_inquiry', 'dispatch_automation'],
      outcome: 'qualified_lead',
      sentiment: 'positive',
      priority: 'high',
      customerName: 'Vikram',
      organization: 'Apex Logistics',
      phone: '+14155559876',
      email: 'vikram@apexlogistics.in',
      topics: ['Voice AI', 'Logistics Dispatch', 'Demo Scheduling', 'CRM Integration'],
      questions: ['Does P2D integrate with dispatch workflows?'],
      objections: [],
      commitments: ['Agent committed to sending calendar invitation for Tuesday 2 PM IST to vikram@apexlogistics.in.'],
      nextBestAction: 'Send calendar invite with meeting link and prepare custom logistics case study deck.',
      createdAt: sampleCall.endedAt || sampleCall.startedAt,
    };
    this.analyses.set(sampleConvId, sampleAnalysis);

    const sampleActions: ActionItem[] = [
      {
        id: 'act_01',
        conversationId: sampleConvId,
        organizationId: orgId,
        actionType: 'schedule_demo',
        description: 'Send calendar invitation for 30-min demo on Tuesday at 2 PM IST to vikram@apexlogistics.in',
        owner: 'sales',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
        status: 'Completed',
        confidence: 0.99,
        sourceMessage: 'Please send the invite to vikram@apexlogistics.in.',
        workflowId: workflowId,
        createdAt: sampleCall.endedAt || sampleCall.startedAt,
        updatedAt: sampleCall.endedAt || sampleCall.startedAt,
      },
      {
        id: 'act_02',
        conversationId: sampleConvId,
        organizationId: orgId,
        actionType: 'send_case_study',
        description: 'Send Logistics & Dispatch Voice Automation Case Study to Vikram',
        owner: 'marketing',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: 'Pending',
        confidence: 0.92,
        createdAt: sampleCall.endedAt || sampleCall.startedAt,
        updatedAt: sampleCall.endedAt || sampleCall.startedAt,
      },
    ];
    this.actions.set(sampleConvId, sampleActions);
  }
}

export const memoryStore = new MemoryStore();
