const axios = require("axios");

exports.main = async (context = {}) => {
  const LOG_ACTIVATED = true;
  const contactID = context?.parameters?.contactID;

  if (!contactID)
    return { success: false, message: "Get Contact Details: No contact ID provided." };

  //Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,

  const propertiesFields  = ["firstname", "lastname", "email", "title", "document", "signerid", "signature_request_id", "document_ids"]
  const propertiesQuery   = propertiesFields.map(field => `properties=${field}`).join("&")

  try {
    if (LOG_ACTIVATED)
        console.log("Fetching contact details for contact ID:", contactID);

    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactID}?${propertiesQuery}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (LOG_ACTIVATED)
        console.log("Contact details fetched successfully:", response?.data);

    return {
      success: true,
      contact: response?.data?.properties
    };
  } catch (error) {
    console.error("Error fetching contact:", error?.response?.data || error?.message);
    return { success: false, message: "Error fetching contact.", error: error?.message };
  }
};
