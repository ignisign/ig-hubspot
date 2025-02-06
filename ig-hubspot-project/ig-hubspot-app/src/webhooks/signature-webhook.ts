import { hubspot } from '@hubspot/api-client';
import { IgnisignWebhookResponse, IGNISIGN_WEBHOOK_ACTION_SIGNATURE_REQUEST } from '../types/ignisign';

export const handleSignatureWebhook = async (req: any, res: any) => {
  try {
    const webhookData = req.body as IgnisignWebhookResponse;

    // Only process COMPLETED events
    if (webhookData.status !== IGNISIGN_WEBHOOK_ACTION_SIGNATURE_REQUEST.COMPLETED) {
      return res.status(200).json({ message: 'Event ignored' });
    }

    // Get the contact ID from the external ID (stored during signature request creation)
    const contactId = webhookData.signatureRequestExternalId;
    if (!contactId) {
      throw new Error('No contact ID found in webhook data');
    }

    // Update HubSpot contact properties
    const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
    
    await hubspotClient.crm.contacts.basicApi.update(contactId, {
      properties: {
        'ignisign_signature_status': 'completed',
        'ignisign_signature_completed_at': new Date().toISOString()
      }
    });

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing signature webhook:', error);
    res.status(500).json({ error: error.message });
  }
}; 