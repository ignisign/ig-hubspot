import { IgnisignConfig, IgnisignSignatureRequestOneCall } from '../types/ignisign.types';

export class IgnisignService {
  private config: IgnisignConfig;

  constructor(config: IgnisignConfig) {
    this.config = config;
  }

  async createSignatureRequest(request: IgnisignSignatureRequestOneCall): Promise<any> {
    try {
      const response = await fetch('https://api.ignisign.io/v4/signature-requests/one-call-sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ignisign API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating signature request:', error);
      throw error;
    }
  }
} 