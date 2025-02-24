import { Client } from '@hubspot/api-client';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export class HubSpotAuth {
  private config: OAuthConfig;
  private tokenStore: Map<string, string> = new Map(); // In production, use a proper database

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  getAuthUrl(state: string): string {
    const scopes = this.config.scopes.join(' ');
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: scopes,
      state
    });

    return `https://app.hubspot.com/oauth/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<string> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      code
    });

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  }

  async getClient(portalId: string): Promise<Client> {
    const accessToken = this.tokenStore.get(portalId);
    if (!accessToken) {
      throw new Error('Portal not authenticated');
    }

    return new Client({ accessToken });
  }

  setToken(portalId: string, token: string): void {
    this.tokenStore.set(portalId, token);
  }
}

// Create default instance with environment variables
export const hubspotAuth = new HubSpotAuth({
  clientId: process.env.HUBSPOT_CLIENT_ID || '',
  clientSecret: process.env.HUBSPOT_CLIENT_SECRET || '',
  redirectUri: process.env.HUBSPOT_REDIRECT_URI || '',
  scopes: [
    'crm.objects.contacts.write',
    'crm.objects.contacts.read',
    'crm.schemas.contacts.write',
    'crm.schemas.contacts.read'
  ]
}); 