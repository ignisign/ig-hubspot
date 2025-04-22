const axios = require("axios");

exports.main = async (context) => {
  try {
    const LOG_ACTIVATED = true;
    let fileIds = context?.parameters?.document;

    // Validate input
    if (!fileIds || (Array.isArray(fileIds) && fileIds.length === 0)) {
      return { success: false, message: "No file IDs provided." };
    }

    // Ensure fileIds is a string
    if (Array.isArray(fileIds)) {
      fileIds = fileIds.join(";");

    } else if (typeof fileIds !== "string") {
      return { success: false, message: "Invalid fileIds format. Expected a string or an array." };
    }

    // Convert fileIds string into an array
    const fileIdsArray = fileIds.split(";").map(id => id.trim()).filter(Boolean);
    if (LOG_ACTIVATED)
    console.log("Processing file IDs:", fileIdsArray);

    if (fileIdsArray.length === 0) {
      return { success: false, message: "No valid file IDs found." };
    }

    if (LOG_ACTIVATED)
        console.log("Processing file IDs:", fileIdsArray);

    // Fetch file details
    const fileDetailsPromises = fileIdsArray.map(fetchFileDetails);

    // Use Promise.allSettled to handle failures gracefully
    const results = await Promise.allSettled(fileDetailsPromises);

    // Process successful and failed results
    const fileDetailsList = results
      .filter(result => result.status === "fulfilled")
      .map(result => result.value);

    const errors = results
      .filter(result => result.status === "rejected")
      .map(result => result.reason);

    if (LOG_ACTIVATED){
        console.log("File Details:", fileDetailsList);
        console.log("Errors:", errors);
    }

    return {
      success: errors.length === 0,
      documentDetails: fileDetailsList,
      errors: errors.length > 0 ? errors : undefined, // Include errors only if there are failures
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};

// Function to fetch file details from HubSpot API
const fetchFileDetails = async (fileId) => {
  try {
    console.log(`Fetching details for file ID: ${fileId}`);
    
    const response = await axios.get(`https://api.hubapi.com/files/v3/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data) {
      throw new Error(`No data returned for file ID ${fileId}`);
    }

    return {
      id                : fileId,
      name              : response?.data?.name              || "Unknown",
      path              : response?.data?.path              || "Unknown",
      encoding          : response?.data?.encoding          || "Unknown",
      type              : response?.data?.type              || "Unknown",
      extension         : response?.data?.extension         || "Unknown",
      defaultHostingUrl : response?.data?.defaultHostingUrl || "Unknown",
      url               : response?.data?.url               || "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching details for file ID ${fileId}:`, error.response ? error.response.data : error.message);
    throw {
      fileId,
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status || 500,
    };
  }
};
