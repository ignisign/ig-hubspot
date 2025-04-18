const axios = require('axios');

exports.main = async (context) => {

  const appID     = 'TOTO'; //context.secrets?.IGNISIGN_APP_ID
  const appEnv    = 'TOTO'; //context.secrets?.IGNISIGN_APP_ENV
  const appSecret = 'TOTO'; //context.secrets?.IGNISIGN_APP_SECRET

  const inputValue = context.parameters.input_value;
  
  try {
    const LOG_ACTIVATED = true;
    
    if (LOG_ACTIVATED)
        console.log("Checking signature status for:", inputValue);

    const payload = { signatureRequestIds: [ inputValue ] }

    const response = await axios.post(
      `https://api.ignisign.io/v4/applications/${appID}/envs/${appEnv}/signature-requests/status`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${appSecret}`,
        }
      }
    );

    if (LOG_ACTIVATED)
        console.log("Signature status response:", response?.data);

    return {
      success: true,
      signatureRequests: response?.data?.signatureRequests,
    };
  } catch (error) {
    console.error("Error checking signature status:", error.response?.data || error.message);

    return {
      success: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};
