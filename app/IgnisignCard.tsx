import {
  Heading,
  Text,
  Stack,
  Button,
  hubspot,
} from '@hubspot/ui-extensions';
import React from 'react';

interface Contact {
  email: string;
  firstname: string;
  lastname: string;
}

// Define the component
const IgnisignCard = () => {
  const [contact, setContact] = React.useState<Contact>({
    email: '',
    firstname: '',
    lastname: '',
  });

  React.useEffect(() => {
    const fetchContact = async () => {
      try {
        const result = await hubspot.serverless('getContact');
        if (result) {
          setContact(result);
        }
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    fetchContact();
  }, []);

  const handleRequestSignature = () => {
    // TODO: Implement signature request
    console.log('Requesting signature for:', contact);
  };

  return (
    <Stack distance="medium">
      <Heading>Ignisign Digital Signature</Heading>
      <Stack>
        <Text format={{ fontWeight: 'bold' }}>Contact Information:</Text>
        <Text>Name: {contact.firstname} {contact.lastname}</Text>
        <Text>Email: {contact.email}</Text>
      </Stack>
      <Button onClick={handleRequestSignature}>
        Request Signature
      </Button>
    </Stack>
  );
};

// Register the extension
hubspot.extend(() => <IgnisignCard />); 