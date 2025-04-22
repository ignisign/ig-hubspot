const axios = require('axios');

exports.main = async (context) => {
    const LOG_ACTIVATED = true;
    
    if (LOG_ACTIVATED)
        console.log("Received Parameters:", context.parameters);
    

    try {

        const appSecret = process.envIGNISIGN_APP_SECRET

        const signatureMethod   = context.parameters.signatureMethod || "SIMPLE_STD"
        const document          = context.parameters.documentData;
        const previousDocument  = (!(context?.parameters?.previous_document)) 
            ? [] 
            : context?.parameters?.previous_document.split(";");
        

        if (!Array.isArray(document) || document.length === 0) {
            console.log("Invalid or empty document data:", document);
            return { success: false, message: "Invalid or empty document data." };
        }

        if (LOG_ACTIVATED)
            console.log("Document details before returning response:", document);

        
        const newDocuments = (previousDocument.length === 0)
            ? document  
            : document.filter(doc => !previousDocument.includes(doc.id));

        const documentsToSend = ((newDocuments.length === 0) 
            ? document 
            : newDocuments)
                .map((doc) => ({
                    originalName: doc.name,
                    mimeType: doc.extension,
                    url: doc.url
                }));

        const payload = {
            title: context.parameters.title || "Default Title",
            signatureMethod: signatureMethod,
            signers: [
                {
                    email       : context.parameters.email,
                    firstName   : context.parameters.firstname,
                    lastName    : context.parameters.lastname,
                }
            ],
            documents: documentsToSend // Dynamically added new documents or existing documents
        };

        if (LOG_ACTIVATED)
            console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        // API call to send the request to Ignisign API
        const response = await axios.post(
            "https://api.ignisign.io/v4/signature-requests/one-call-sign",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${appSecret}`
                }
            }
        );

        return {
            success: true,
            signatureRequestId: response.data.signatureRequestId,
        };

    } catch (error) {
        console.error("Error in API call:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || error.message,
        };
    }
};

