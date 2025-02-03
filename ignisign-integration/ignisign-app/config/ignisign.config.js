const environments = {
  development: {
    apiUrl: 'https://api.ignisign.io/v4',
    // The API key will be injected from HubSpot secrets
    apiKey: process.env.IGNISIGN_API_KEY || '',
  },
  production: {
    apiUrl: 'https://api.ignisign.io/v4',
    // The API key will be injected from HubSpot secrets
    apiKey: process.env.IGNISIGN_API_KEY || '',
  },
};

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return environments[env];
};

module.exports = {
  getConfig,
}; 