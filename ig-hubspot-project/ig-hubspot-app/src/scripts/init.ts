import { hubspotAuth } from '../auth/hubspot-auth';
import { setupWebhook } from '../webhooks/webhook-config';
import config from '../config/config';
import * as fs from 'fs';
import * as path from 'path';

const initializeHubSpotProperties = async (portalId: string) => {
  try {
    const hubspotClient = await hubspotAuth.getClient(portalId);
    
    // Read properties configuration
    const propertiesConfig = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../hubspot-properties.json'),
        'utf-8'
      )
    );

    // Create property group if it doesn't exist
    try {
      await hubspotClient.crm.properties.groupsApi.create('contacts', {
        name: 'ignisign_information',
        label: 'Ignisign Information',
        displayOrder: 1
      });
    } catch (error) {
      // Group might already exist, continue
      console.log('Property group already exists or error creating:', error);
    }

    // Create each property
    for (const property of propertiesConfig.properties) {
      try {
        await hubspotClient.crm.properties.coreApi.create('contacts', {
          ...property,
          hasUniqueValue: false,
          hidden: false,
          formField: true
        });
        console.log(`Created property: ${property.name}`);
      } catch (error) {
        console.log(`Property ${property.name} already exists or error:`, error);
      }
    }

    console.log('HubSpot properties initialized successfully');
  } catch (error) {
    console.error('Error initializing HubSpot properties:', error);
    throw error;
  }
};

const initialize = async (portalId: string) => {
  try {
    console.log('Starting initialization...');
    
    // Initialize HubSpot properties
    await initializeHubSpotProperties(portalId);
    console.log('HubSpot properties initialized');
    
    // Setup webhook
    await setupWebhook();
    console.log('Webhook configured');
    
    console.log('Initialization completed successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization if this script is run directly
if (require.main === module) {
  const portalId = process.argv[2];
  if (!portalId) {
    console.error('Please provide a portal ID as an argument');
    process.exit(1);
  }
  initialize(portalId);
} 