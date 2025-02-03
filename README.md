# HubSpot Ignisign Integration

This project integrates Ignisign's digital signature capabilities with HubSpot CRM, allowing you to send signature requests directly from contact and deal records.

## Features

- Send signature requests directly from HubSpot CRM
- Support for multiple signature methods (email, SMS, strong identification)
- Document upload support (PDF, DOC, DOCX)
- Automatic signer information from HubSpot contacts
- Environment-based configuration

## Prerequisites

- HubSpot account with CMS Free, Starter, Pro, or Enterprise access
- [Node.js](https://nodejs.org/en/) - v16.0 or higher and associated version of NPM
- Ignisign API key

## Project Structure

```
ignisign-integration/
├── ignisign-app/
│   └── components/
│       ├── crm/              # CRM card components
│       ├── services/         # API services
│       └── types/           # TypeScript types and interfaces
└── hsproject.json           # HubSpot project configuration

ignisign-theme/
└── layouts/                 # HubSpot theme layouts
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your HubSpot CLI:
   ```bash
   hs init
   ```
   Make sure your access key includes: `CMS Pages`, `Design Manager`, `Developer Projects`, and `GraphQL Data Fetching` permissions.

4. Set up your Ignisign API key in HubSpot secrets:
   - Go to your HubSpot developer account
   - Navigate to Settings > Secrets
   - Add a new secret with the key `IGNISIGN_API_KEY`
   - Input your Ignisign API key value

5. Deploy the project:
   ```bash
   npm run deploy
   ```

## Development

Start the local development server:
```bash
npm run start
```

## Deployment

Deploy changes to HubSpot:
```bash
npm run deploy
```

## License

Apache-2.0
