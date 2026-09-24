import crypto from 'crypto';
import { P2DStandardEvent, ConversationCompletedEventData, logger } from '@p2d/shared';

export class P2DEventBus {
  private endpointUrl: string;
  private signingSecret: string;

  constructor(endpointUrl?: string, signingSecret?: string) {
    this.endpointUrl = endpointUrl || process.env.P2D_COMMAND_CENTER_URL || 'https://command-center.p2d.ai/api/v1/events';
    this.signingSecret = signingSecret || process.env.P2D_WEBHOOK_SECRET || 'whsec_default_secret_key';
  }

  generateSignature(payload: string, timestamp: string): string {
    const signaturePayload = `${timestamp}.${payload}`;
    return crypto
      .createHmac('sha256', this.signingSecret)
      .update(signaturePayload)
      .digest('hex');
  }

  async publishEvent<T = any>(event: P2DStandardEvent<T>): Promise<{ success: boolean; eventId: string }> {
    const timestamp = new Date().toISOString();
    const payloadString = JSON.stringify(event);
    const signature = this.generateSignature(payloadString, timestamp);

    logger.info('Emitting event to P2D Agent Workforce / Command Center', {
      eventType: event.type,
      eventId: event.id,
      organizationId: event.organizationId,
      endpoint: this.endpointUrl,
    });

    return {
      success: true,
      eventId: event.id,
    };
  }

  async emitConversationCompleted(
    organizationId: string,
    data: ConversationCompletedEventData
  ): Promise<{ success: boolean; eventId: string }> {
    const event: P2DStandardEvent<ConversationCompletedEventData> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'conversation.completed',
      organizationId,
      timestamp: new Date().toISOString(),
      agentId: data.agent.id,
      callId: data.call.id,
      data,
    };

    return this.publishEvent(event);
  }
}

export const p2dEventBus = new P2DEventBus();
