const axios = require("axios");

exports.main = async (context) => {
  const LOG_ACTIVATED = true;
  const contactID = context.parameters.contact_id;
  if (!contactID) {
    return {
      success: false,
      message: "Missing required parameters: contactID",
    };
  }  

  try {
    const payload = {
      properties: {
        signerid: context.parameters.signer_id,
        signature_request_id: context.parameters.signature_requestId,
        document_ids: context.parameters.documents_ids,
      },
    };

    if (LOG_ACTIVATED)
        console.log("Updating contact with payload:", JSON.stringify(payload, null, 2));

    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactID}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`, 
          "Content-Type": "application/json",
        },
      }
    );

    if (LOG_ACTIVATED)
        console.log("HubSpot API Response:", response.data);

    return {
      success: true,
      contact: response.data,
    };
  } catch (error) {
    console.error("Error updating contact:", error.response?.data || error.message);
    return {
      success: false,
      message: "Error updating contact in HubSpot.",
      error: error.response?.data || error.message,
    };
  }
};
