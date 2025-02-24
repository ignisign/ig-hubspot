
We want to integrate the Ignisign Api into Hubspot. the integration will be done through the Customization UI principle.
https://developers.hubspot.com/docs/guides/crm/ui-extensions/overview

Ignisign is a signature platform, that allow to send signature request to join a document. (https://ignisign.io - account creation is free)

## Functional requirements:

We want to have a button, linked to "client" (in the CRM port of hubspot), that allow to send a Ignisign signature request with a document to join.

### Ignisign Account Handling:
The integration with the Ignisign API will be done through an apiKey to provide in the Authorization header of the request (bearer). 
the apiKey will be stored in the Hubspot secret store / settings.
Ignisign have a webhook mecanism to notify the application of the signature status.
the webhook configuration must be done in the association process, if not already be done.

### Document Handling:
The document will be a PDF file, that will be uploaded to the Ignisign platform.
It could be uploaded directly from the Hubspot UI or selected from the existing files in Hubspot. It also could be a URL to an external document.

### Signers Handling:
The signers information will be retrieved from the "client" object in Hubspot.
optionally, other signers could be added to the signature request. an easy way to add the hubspot user have to be provided.

### Signature Status:
The signature status will be retrieved from the Ignisign API and displayed in the Hubspot UI.
the notification mecanism will be used to update the signature status in the Hubspot object.

### Signature Proof:
The signature proof will be retrieved from the Ignisign API and displayed in the Hubspot UI.

Ignisign documentation : 

https://ignisign.io/docs/category/ignisign-api

main endpoints documentation to handle the process:

https://ignisign.io/docs/ignisign-api/create-signature-request-in-one-call
https://ignisign.io/docs/ignisign-api/get-signature-request-context
https://ignisign.io/docs/ignisign-api/download-signature-by-type

https://ignisign.io/docs/ignisign-api/get-webhook-end-points
https://api.ignisign.io/v4/applications/:appId/envs/:appEnv/webhooks

webhook events :
https://ignisign.io/docs/webhooks/signatureSession




-----


Below is a refined and formalized version of the job proposal:

---

**Job Title:** Integration of Ignisign API into Hubspot via Customization UI

**Project Overview:**

We are seeking an experienced developer to integrate the Ignisign API into Hubspot using Hubspot’s Customization UI, as described in the [Hubspot CRM UI Extensions documentation](https://developers.hubspot.com/docs/guides/crm/ui-extensions/overview). Ignisign is a digital signature platform that enables users to send signature requests for documents. (For more details and a free account, visit [Ignisign](https://ignisign.io).)

**Functional Requirements:**

1. **User Interface Integration:**
   - Add a button within the Hubspot CRM portal, associated with the “client” object.
   - This button will trigger the process to send a signature request via Ignisign for the selected client.

2. **Ignisign Account Handling:**
   - Integrate with the Ignisign API using an API key provided in the Authorization header (Bearer token).
   - Securely store the API key in Hubspot’s secret store or settings.
   - Utilize Ignisign’s webhook mechanism to receive notifications about signature status changes.
   - Ensure that the webhook configuration is set up during the integration process if it has not been configured previously.

3. **Document Handling:**
   - Enable the upload of PDF documents to the Ignisign platform.
   - Allow users to either:
     - Upload documents directly from the Hubspot UI,
     - Select documents from existing files within Hubspot, or
     - Provide a URL to an external document.

4. **Signers Handling:**
   - Automatically retrieve signer information from the “client” object in Hubspot.
   - Allow the option to add additional signers to the signature request.
   - Provide an intuitive method for including Hubspot users as additional signers.

5. **Signature Status:**
   - Retrieve and display the signature status from the Ignisign API in the Hubspot UI.
   - Implement real-time updates using the webhook notifications to reflect the current signature status on the Hubspot object.

6. **Signature Proof:**
   - Retrieve and display the signature proof from the Ignisign API within the Hubspot UI.

**Relevant Documentation and Endpoints:**

- **Ignisign API Documentation:**  
  [Ignisign API Overview](https://ignisign.io/docs/category/ignisign-api)

- **Key Endpoints:**
  - [Create Signature Request in One Call](https://ignisign.io/docs/ignisign-api/create-signature-request-in-one-call)
  - [Get Signature Request Context](https://ignisign.io/docs/ignisign-api/get-signature-request-context)
  - [Download Signature by Type](https://ignisign.io/docs/ignisign-api/download-signature-by-type)
  - [Get Webhook Endpoints](https://ignisign.io/docs/ignisign-api/get-webhook-end-points)
  - Webhook configuration endpoint: `https://api.ignisign.io/v4/applications/:appId/envs/:appEnv/webhooks`
  - [Webhook Events Documentation](https://ignisign.io/docs/webhooks/signatureSession)

**Deliverables:**

- A fully functional integration of the Ignisign API with Hubspot via the Customization UI.
- Secure storage and management of the Ignisign API key.
- An enhanced Hubspot UI featuring a button to initiate signature requests.
- Real-time updates and display of signature status and proof using webhooks.
- Comprehensive documentation detailing the integration setup and usage instructions.

**Required Skills and Experience:**

- Proven experience with API integrations, especially with RESTful APIs.
- Familiarity with Hubspot’s CRM platform and Customization UI.
- Experience with secure API key management and webhook configuration.
- Proficiency in JavaScript, HTML, and CSS for UI development.
- Knowledge of document management and PDF handling is a plus.

**How to Apply:**

Please provide examples of similar integrations you have completed along with your estimated timeline and cost for the project. We look forward to reviewing your application and working with you on this exciting integration.

---

Feel free to adjust any section to better fit your specific requirements or company style.




