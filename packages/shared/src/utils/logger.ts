export interface LoggerContext {
  organizationId?: string;
  userId?: string;
  requestId?: string;
  callId?: string;
  conversationId?: string;
  agentId?: string;
  workflowExecutionId?: string;
  [key: string]: any;
}

export class Logger {
  private serviceName: string;

  constructor(serviceName = 'p2d-voice') {
    this.serviceName = serviceName;
  }

  private formatMessage(level: string, message: string, context?: LoggerContext): string {
    const timestamp = new Date().toISOString();
    const logObj = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...context,
    };
    return JSON.stringify(logObj);
  }

  info(message: string, context?: LoggerContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LoggerContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: LoggerContext, error?: Error): void {
    const errorDetails = error
      ? { errorMessage: error.message, stack: error.stack }
      : undefined;
    console.error(this.formatMessage('error', message, { ...context, ...errorDetails }));
  }

  debug(message: string, context?: LoggerContext): void {
    if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger('p2d-voice-ai-platform');
