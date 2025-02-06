declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IGNISIGN_API_KEY: string;
      HUBSPOT_ACCESS_TOKEN: string;
    }
  }
}

interface Config {
  ignisignApiKey: string;
  hubspotAccessToken: string;
}

const config: Config = {
  ignisignApiKey: process.env.IGNISIGN_API_KEY || '',
  hubspotAccessToken: process.env.HUBSPOT_ACCESS_TOKEN || ''
};

if (!config.ignisignApiKey) {
  console.error('IGNISIGN_API_KEY environment variable is not set');
}

if (!config.hubspotAccessToken) {
  console.error('HUBSPOT_ACCESS_TOKEN environment variable is not set');
}

export default config; 