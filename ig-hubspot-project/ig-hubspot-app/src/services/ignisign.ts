import { 
  IgnisignSignatureRequest, 
  IgnisignWebhookResponse,
  IGNISIGN_WEBHOOK_ACTION_SIGNATURE_REQUEST 
} from '../types/ignisign';

const IGNISIGN_API_URL = 'https://api.ignisign.io/v4';

export class IgnisignService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${IGNISIGN_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Ignisign API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createSignatureRequest(request: IgnisignSignatureRequest) {
    return this.request('/signature-requests/one-call-sign', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getWebhookEndpoints() {
    return this.request('/webhook-endpoints');
  }

  async addWebhookEndpoint(url: string) {
    return this.request('/webhook-endpoints', {
      method: 'POST',
      body: JSON.stringify({
        url,
        events: [IGNISIGN_WEBHOOK_ACTION_SIGNATURE_REQUEST.COMPLETED]
      }),
    });
  }

  async getSignatureRequestStatus(signatureRequestId: string) {
    return this.request(`/signature-requests/${signatureRequestId}`);
  }
} 