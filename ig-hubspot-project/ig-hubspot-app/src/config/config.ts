interface Config {
  ignisignApiKey: string;
}

const config: Config = {
  ignisignApiKey: process.env.IGNISIGN_API_KEY || '',
};

if (!config.ignisignApiKey) {
  console.error('IGNISIGN_API_KEY environment variable is not set');
}

export default config; 