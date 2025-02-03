import React, { useState } from 'react';
import { 
  Form,
  Input,
  Select,
  Alert,
  Button,
  Text,
  Box,
  Image,
  Stack,
  Divider
} from '@hubspot/ui-extensions';
import { IgnisignService } from '../services/ignisign.service';
import { 
  IGNISIGN_SIGNATURE_METHOD_REF, 
  OneCallSignDocument,
  IgnisignSignatureRequestOneCall 
} from '../types/ignisign.types';
import { ASSETS } from '../../constants/assets';

interface IgnisignCardProps {
  contact: {
    email: string;
    firstname: string;
    lastname: string;
  };
  config: {
    apiKey: string;
    apiUrl: string;
  };
}

export const IgnisignCard = ({ contact, config }: IgnisignCardProps) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [signatureMethod, setSignatureMethod] = useState<IGNISIGN_SIGNATURE_METHOD_REF>(
    IGNISIGN_SIGNATURE_METHOD_REF.SIMPLE_STD
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (value: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFile(files[0]);
      }
    };
    input.click();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!file) {
        throw new Error('Please select a file');
      }

      const base64File = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      const document: OneCallSignDocument = {
        originalName: file.name,
        mimeType: file.type,
        base64: base64File.split(',')[1],
      };

      const signatureRequest: IgnisignSignatureRequestOneCall = {
        title,
        signatureMethod,
        signers: [{
          email: contact.email,
          firstName: contact.firstname,
          lastName: contact.lastname,
        }],
        documents: [document],
      };

      const ignisignService = new IgnisignService(config);
      await ignisignService.createSignatureRequest(signatureRequest);

      // Reset form
      setTitle('');
      setFile(null);
      setSignatureMethod(IGNISIGN_SIGNATURE_METHOD_REF.SIMPLE_STD);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box>
        <Stack direction="row" align="center">
          <Image src={ASSETS.IMAGES.LOGO} alt="Ignisign Logo" width={32} height={32} />
          <Text>Document Signature Request</Text>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert title={error} variant="error" />
          )}
          
          <Input
            label="Signature Request Title"
            name="title"
            value={title}
            onChange={value => setTitle(value)}
            required
          />

          <Select
            label="Signature Method"
            value={signatureMethod}
            onChange={value => setSignatureMethod(value as IGNISIGN_SIGNATURE_METHOD_REF)}
            options={Object.entries(IGNISIGN_SIGNATURE_METHOD_REF).map(([key, value]) => ({
              label: value,
              value: value,
            }))}
            required
          />

          <Input
            label="Document to Sign"
            name="file"
            value={file ? file.name : ''}
            onChange={handleFileChange}
            required
            readOnly
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Sending...' : 'Send for Signature'}
          </Button>
        </Form>
      </Box>
    </Box>
  );
}; 