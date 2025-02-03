export enum IGNISIGN_SIGNATURE_METHOD_REF {
  SIMPLE_STD = "email Validation",
  ADVANCED_SMS = "email + SMS Validation",
  ADVANCED_STD = "validtion with strong identification"
}

export interface OneCallSignSigner {
  email: string;
  firstName?: string;
  lastName?: string;
  signerProfileId?: string;
}

export interface OneCallSignDocument {
  originalName: string;
  mimeType: string;
  base64?: string;
  url?: string;
}

export interface IgnisignSignatureRequestOneCall {
  title: string;
  signatureMethod: IGNISIGN_SIGNATURE_METHOD_REF;
  signers: OneCallSignSigner[];
  documents: OneCallSignDocument[];
}

export interface IgnisignConfig {
  apiKey: string;
  apiUrl: string;
} 