export type IntegrationProvider =
  | 'webhook'
  | 'salesforce'
  | 'hubspot'
  | 'zoho'
  | 'slack'
  | 'teams'
  | 'p2d_command_center'
  | 'custom_rest';

export type IntegrationAuthType = 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';

export interface Integration {
  id: string;
  organizationId: string;
  name: string;
  provider: IntegrationProvider;
  baseUrl: string;
  authType: IntegrationAuthType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EncryptedCredential {
  id: string;
  integrationId: string;
  encryptedData: string;
  iv: string;
  authTag: string;
  createdAt: string;
  updatedAt: string;
}
