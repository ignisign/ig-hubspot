import { IgnisignService } from '../services/ignisign';
import config from '../config/config';

export const setupWebhook = async () => {
  try {
    const ignisignService = new IgnisignService(config.ignisignApiKey);
    
    // First, check if webhook is already configured
    const endpoints = await ignisignService.getWebhookEndpoints();
    const webhookUrl = `${process.env.HUBSPOT_APP_URL}/webhooks/signature`;
    
    // Check if our webhook URL is already registered
    const existingWebhook = endpoints.find((endpoint: any) => endpoint.url === webhookUrl);
    
    if (!existingWebhook) {
      // Add new webhook endpoint
      await ignisignService.addWebhookEndpoint(webhookUrl);
      console.log('Webhook endpoint configured successfully');
    } else {
      console.log('Webhook endpoint already configured');
    }
  } catch (error) {
    console.error('Error configuring webhook:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}; 