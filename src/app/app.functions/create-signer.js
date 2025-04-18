const axios = require('axios');

exports.main = async (context) => {
  try {
    const LOG_ACTIVATED = false;
    //const { firstname, lastname, email, phone } = context.parameters;
    const firstname = context.parameters.firstname;
    const lastname = context.parameters.lastname;
    const email = context.parameters.email;
    
    const appID = 'TOTO'; //context.secrets?.IGNISIGN_APP_ID
    const appEnv = 'TOTO'; //context.secrets?.IGNISIGN_APP_ENV
    const appSecret = 'TOTO'; //context.secrets?.IGNISIGN_APP_SECRET


    const payload = {
      firstName: firstname,
      lastName: lastname,
      email: email
    };

    if (LOG_ACTIVATED)
        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `https://api.ignisign.io/v4/applications/${appID}/envs/${appEnv}/signers`,
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
        console.log("Signer created successfully:", response.data);

    return {
      success: true,
      signerId: response.data.signerId,
    };
  } catch (error) {
    
    console.error("Error creating signer:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
