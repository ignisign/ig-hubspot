declare module '@hubspot/api-client' {
  export class Client {
    constructor(options: { accessToken: string });
    
    crm: {
      contacts: {
        basicApi: {
          update: (
            contactId: string,
            properties: {
              properties: Record<string, string>;
            }
          ) => Promise<void>;
        };
      };
    };
  }
} 