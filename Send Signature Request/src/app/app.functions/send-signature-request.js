// const axios = require('axios');

// exports.main = async (context) => {
//     console.log("Received Parameters:", context.parameters);

//     try {
//         let document = context.parameters.documentData;
//         let previousDocument = context.parameters.previous_document.split(";"); // Split the string of IDs into an array

//         // Validate if the document and previousDocument arrays are valid
//         if (!Array.isArray(document) || document.length === 0) {
//             console.log("Invalid or empty document data:", document);
//             return { success: false, message: "Invalid or empty document data." };
//         }

//         if (!Array.isArray(previousDocument) || previousDocument.length === 0) {
//             console.log("Invalid previous document data:", previousDocument);
//             return { success: false, message: "Invalid previous document data." };
//         }

//         console.log("Document details before returning response:", document);

//         // Find the documents that are in 'document' but not in 'previousDocument'
//         const newDocuments = document.filter(doc => !previousDocument.includes(doc.id));

//         if (newDocuments.length === 0) {
//             console.log("No new documents to process.");
//             return { success: false, message: "No new documents to process." };
//         }

//         console.log("New Documents identified for processing:", newDocuments);

//         // Map the newDocuments array to match the expected format for the API payload
//         const documents = newDocuments.map((doc) => ({
//             originalName: doc.name,   // Assuming `doc.name` is the original name of the document
//             mimeType: doc.extension,  // Assuming `doc.extension` is the file type/extension
//             url: doc.url              // Assuming `doc.url` is the URL for accessing the document
//         }));

//         const payload = {
//             title: context.parameters.title || "Default Title",
//             signatureMethod: "SIMPLE_STD",
//             signers: [
//                 {
//                     email: context.parameters.email,
//                     firstName: context.parameters.firstname,
//                     lastName: context.parameters.lastname,
//                     signerProfileId: "67bde05b4e629900125fa85b"
//                 }
//             ],
//             documents: documents // Dynamically added new documents
//         };

//         console.log("Payload being sent:", JSON.stringify(payload, null, 2));

//         // API call to send the request to Ignisign API
//         const response = await axios.post(
//             "https://api.ignisign.io/v4/signature-requests/one-call-sign",
//             payload,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                     "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFwcElkX2FlODViMGM5LTg2NTgtNGYxZS1hOGMyLTRmYjhiNTI0MzBlMiIsImFwcEVudiI6IkRFVkVMT1BNRU5UIiwiY2xhaW1zVHlwZSI6IkFQUF9BUEkiLCJpYXQiOjE3NDE3NTkzOTMsImV4cCI6MTc0MTg0NTc5M30.Uj6oYECAg9DMip-lp33JeAM3P0KjuLjtIs0zDORm3zQcGIcrjbHM3GG9Rq7DJXZUf2hqfRfuXYDjkUcAy-0S6x9CfpK-iwiiPCfxz4dESUvRP9T4hmg4fJGnMhoU2BSrZbogPKUJyMuGHHeX_l7vlgO3xu81cDOi0b8SUYvS8gxBGCUlG0n9wVwrN2Qq1VDx6XZL8QxX9WWAuCKS_3jPcK9T2UZ_qFor1zqvJg9T2h89jvsTdpIqbGq-eatlm4On0V5mgk1e1pOAN_6uNx9fsTiepaHrcUoeVxtwQcQfMqC3l6pAXv9ABRAFi2ad9tTFF1HPRbQznw0YxlkW76FrBq9faq57psHe7kT46NG0QU2PJgTTSYC_F0lvBZ2j2gAyYrChZ0Qgfy9JxspKbm5PRkvz9h0zh3eQteNrWGEBkZv0TENQqihUzJv2kQGDYI9SVKtqcbu1gP2A2SIKuMWBWINTs4kHHIUtq_0saYjdbgIhr0iYkq2jOtCpQcTgzAkL-WrJ2iN3hZmWNQVY6zPLxQKTwl0nglbD7CNjnSt71HJdNlsBLxwhl9ZdQhSuy8pNJ6mjn-g2V7T2-03By4XklO4i_x2eMRsaF3X3o5r5e6ySiMQUIgPQQczFu2JLTo-bVwmlCQPnPlEMnuv80nbnTTF4aJddAYCzGwHTM6Xzj-I"
//                 }
//             }
//         );

//         return {
//             success: true,
//             signatureRequestId: response.data.signatureRequestId,
//         };

//     } catch (error) {
//         console.error("Error in API call:", error.response?.data || error.message);
//         return {
//             success: false,
//             message: error.response?.data?.message || error.message,
//         };
//     }
// };

const axios = require('axios');

exports.main = async (context) => {
    console.log("Received Parameters:", context.parameters);

    try {
        let document = context.parameters.documentData;
        let previousDocument = context.parameters.previous_document;
        
        // If previous_document is empty (null, undefined, or empty string), use documentData instead.
        if (!previousDocument) {
            console.log("No previous document data provided. Using all documents.");
            previousDocument = [];  // Initialize as an empty array if null or undefined
        } else {
            previousDocument = previousDocument.split(";");  // Convert to array if provided
        }

        if (!Array.isArray(document) || document.length === 0) {
            console.log("Invalid or empty document data:", document);
            return { success: false, message: "Invalid or empty document data." };
        }

        console.log("Document details before returning response:", document);

        // If previousDocument is empty, use all documents as new documents
        const newDocuments = previousDocument.length === 0
            ? document  // No previous documents, treat all as new
            : document.filter(doc => !previousDocument.includes(doc.id)); // Filter out already processed documents

        let documentsToSend = [];

        if (newDocuments.length === 0) {
            console.log("No new documents to process. Proceeding with existing documents.");
            documentsToSend = document.map((doc) => ({
                originalName: doc.name,
                mimeType: doc.extension,
                url: doc.url
            }));
        } else {
            console.log("New Documents identified for processing:", newDocuments);
            documentsToSend = newDocuments.map((doc) => ({
                originalName: doc.name,
                mimeType: doc.extension,
                url: doc.url
            }));
        }

        const payload = {
            title: context.parameters.title || "Default Title",
            signatureMethod: "SIMPLE_STD",
            signers: [
                {
                    email: context.parameters.email,
                    firstName: context.parameters.firstname,
                    lastName: context.parameters.lastname,
                    signerProfileId: "67bde05b4e629900125fa85b"
                }
            ],
            documents: documentsToSend // Dynamically added new documents or existing documents
        };

        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        // API call to send the request to Ignisign API
        const response = await axios.post(
            "https://api.ignisign.io/v4/signature-requests/one-call-sign",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImFwcElkX2FlODViMGM5LTg2NTgtNGYxZS1hOGMyLTRmYjhiNTI0MzBlMiIsImFwcEVudiI6IkRFVkVMT1BNRU5UIiwiY2xhaW1zVHlwZSI6IkFQUF9BUEkiLCJpYXQiOjE3NDE4NTI4NDgsImV4cCI6MTc0MTkzOTI0OH0.kIMlGUc5gXjvgUMNgYLa2IqgDi8SGorJNL6VfweFEbsUQSNjlCEqDhFQYRmFe0VFbo6_4fTLm66dCnYog2SxLJl-HjzmzI8ik0Co6316jRGAh0zivthTsTEb1gMIYdh1PZH3X-vXLzsG6eDM9VXsw76_FikZJz58tjvA4vz08x9yBeqdCg7OfMyiTmHO2Ix5ASuNKi04TuPbFYk7IRXvPEmg8x-xZwJ4Qw8XvrYuxR_i99we16ZFyNRYlyoe_hMartH4tnJHZ0cpkk8y76NrZQbtm9OdC3ggh8aRaxUiyLAqcP0ZhfP3gmBp6vSO1bnxbzhhsltViwavEJCzumu-Oh0IbjW4vdBHdy9jnIV-76wGlW8Wl4JeHNNa3rDun__nxlDQ7k82ChGxuHhAVkZ5jYJ8RTO_vT-IWgxubKhl8WZwni7etnJz1s57xvMZTfITGnPhUagWDaOdrPXNNCC42Q2LnpMucGLnk-bN6Y_v3w8vla_ilVzAWgUYWx9NSPTFucY_wvyFpZlR6rWX8UhGshTc3EhI6Mt_El1ygIWPA1wgQnSVVXn5zevgHBWJ0wt5gY9eg4R1XGbtlEq6Fom4GCUbzEfVyZBLB6hMbEaxyrP5Ls6bywCIG2TuO4ZEcLonOCd1PzDVyfIMxkSCtr8Zg0pneSwmJs7FjDFAUpVRtPU"
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

