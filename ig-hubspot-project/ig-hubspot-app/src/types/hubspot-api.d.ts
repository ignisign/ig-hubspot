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
      properties: {
        groupsApi: {
          create: (
            objectType: string,
            group: {
              name: string;
              label: string;
              displayOrder: number;
            }
          ) => Promise<void>;
        };
        coreApi: {
          create: (
            objectType: string,
            property: {
              name: string;
              label: string;
              type: string;
              fieldType: string;
              groupName: string;
              description?: string;
              options?: Array<{
                label: string;
                value: string;
              }>;
              formField?: boolean;
              hidden?: boolean;
              hasUniqueValue?: boolean;
            }
          ) => Promise<void>;
        };
      };
    };
  }
} 