import React, { useState, useEffect } from 'react';
import { 
  Divider,
  Button,
  Form,
  Input,
  Select,
  Text,
  hubspot 
} from '@hubspot/ui-extensions';
import { 
  IgnisignService 
} from '../services/ignisign';
import {
  IGNISIGN_SIGNATURE_METHOD_REF,
  IgnisignDocument,
  IgnisignSigner
} from '../types/ignisign';
import config from '../config/config';

interface Props {
  context: {
    portal_id: string;
    user: {
      email: string;
      firstName: string;
      lastName: string;
    };
    contact: {
      id: string;
      properties: {
        email: string;
        firstname: string;
        lastname: string;
      };
    };
  };
}

export const IgnisignCard = ({ context }: Props) => {
  const [title, setTitle] = useState('');
  const [signatureMethod, setSignatureMethod] = useState(IGNISIGN_SIGNATURE_METHOD_REF.SIMPLE_STD);
  const [documents, setDocuments] = useState<IgnisignDocument[]>([]);
  const [additionalSigners, setAdditionalSigners] = useState<IgnisignSigner[]>([]);
  const [includeCurrentUser, setIncludeCurrentUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: IgnisignDocument[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await convertFileToBase64(file);
      newDocuments.push({
        originalName: file.name,
        mimeType: file.type,
        base64
      });
    }
    setDocuments([...documents, ...newDocuments]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const signers: IgnisignSigner[] = [
        {
          email: context.contact.properties.email,
          firstName: context.contact.properties.firstname,
          lastName: context.contact.properties.lastname
        },
        ...additionalSigners
      ];

      if (includeCurrentUser) {
        signers.push({
          email: context.user.email,
          firstName: context.user.firstName,
          lastName: context.user.lastName
        });
      }

      const ignisignService = new IgnisignService(config.ignisignApiKey);
      const response = await ignisignService.createSignatureRequest({
        title,
        signatureMethod,
        signers,
        documents
      });

      // Update HubSpot contact property with signature request ID
      await hubspot.contact.setProperty(context.contact.id, 'ignisign_signature_request_id', response.id);

      // Show success message
      hubspot.ui.showToast({
        message: 'Signature request created successfully',
        type: 'success'
      });
    } catch (error) {
      hubspot.ui.showToast({
        message: `Error creating signature request: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form>
      <Input
        label="Title"
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <Select
        label="Signature Method"
        name="signatureMethod"
        value={signatureMethod}
        onChange={value => setSignatureMethod(value as IGNISIGN_SIGNATURE_METHOD_REF)}
        options={Object.values(IGNISIGN_SIGNATURE_METHOD_REF).map(method => ({
          label: method,
          value: method
        }))}
      />

      <Input
        type="file"
        label="Upload Documents"
        name="documents"
        onChange={handleFileUpload}
        multiple
        required
      />

      {documents.map((doc, index) => (
        <Text key={index}>{doc.originalName}</Text>
      ))}

      <Divider />

      <Text>Primary Signer (Contact)</Text>
      <Text>{context.contact.properties.email}</Text>

      <Divider />

      <Button
        variant="secondary"
        onClick={() => setIncludeCurrentUser(!includeCurrentUser)}
      >
        {includeCurrentUser ? 'Remove Current User' : 'Add Current User as Signer'}
      </Button>

      <Button
        variant="primary"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!title || documents.length === 0}
      >
        Create Signature Request
      </Button>
    </Form>
  );
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}; 