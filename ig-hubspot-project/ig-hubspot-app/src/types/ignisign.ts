export enum IGNISIGN_SIGNATURE_METHOD_REF {
  SIMPLE_STD = "email Validation",
  ADVANCED_SMS = "email + SMS Validation",
  ADVANCED_STD = "validtion with strong identification"
}

export enum IGNISIGN_WEBHOOK_ACTION_SIGNATURE_REQUEST {
  INITIALIZED = "INITIALIZED",
  UPDATED = "UPDATED",
  READY = "READY",
  WAITING_DOCUMENTS = "WAITING_DOCUMENTS",
  LAUNCHED = "LAUNCHED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED"
}

export interface IgnisignSigner {
  email: string;
  firstName?: string;
  lastName?: string;
  signerProfileId?: string;
}

export interface IgnisignDocument {
  originalName: string;
  mimeType: string;
  base64?: string;
  url?: string;
}

export interface IgnisignSignatureRequest {
  title: string;
  signatureMethod: IGNISIGN_SIGNATURE_METHOD_REF;
  signers: IgnisignSigner[];
  documents: IgnisignDocument[];
}

export interface IgnisignWebhookResponse {
  signatureRequestId: string;
  signatureRequestExternalId?: string;
  status: string;
  signers?: {
    signerId: string;
    signerExternalId: string;
    token: string;
  }[];
}

export interface HubspotContact {
  email: string;
  firstname: string;
  lastname: string;
} 