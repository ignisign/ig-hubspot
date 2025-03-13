const axios = require("axios");

exports.main = async (context = {}) => {
  const contactID = context.parameters.contactID;

  if (!contactID) {
    return { success: false, message: "No contact ID provided." };
  }

  //Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,

  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactID}?properties=firstname&properties=lastname&properties=email&properties=title&properties=document&properties=signerid&properties=signature_request_id&properties=document_ids`,
      {
        headers: {
          // Authorization: `Bearer Token`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      success: true,
      contact: response.data.properties
    };
  } catch (error) {
    console.error("Error fetching contact:", error.response?.data || error.message);
    return { success: false, message: "Error fetching contact.", error: error.message };
  }
};
