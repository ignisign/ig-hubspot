# Installation of the IgniSign HubSpot Project

- Create an account into Ignisign and obtain api creadentials : https://ignisign.io/docs/quick-start/Create_an_account

- Fork the  Ignisign Hubspot integration github repository:  https://github.com/ignisign/ig-hubspot

- Install Hubspot CLI - https://developers.hubspot.com/docs/guides/cms/tools/hubspot-cli/cli-v7
- Authenticate to Hubspot with the cli : `hs account auth` (then follow instructions)

- Add secrets using Hubspot CLI - https://developers.hubspot.com/docs/guides/cms/tools/hubspot-cli/cli-v7#add-a-secret
   - IGNISIGN_APP_SECRET
   - IGNISIGN_APP_ID
   - IGNISIGN_APP_ENV

add the secret to access to the HUBSPOT api : "HUBSPOT_ACCESS_TOKEN" (use desciption here : https://developers.hubspot.com/docs/guides/apps/private-apps/overview#make-api-calls-with-your-app-s-access-token)




,
  "webhooks": {
    "file": "./webhooks/webhooks.json"
  }