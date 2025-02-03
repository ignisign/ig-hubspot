import React from 'react';
import {
  Heading,
  Text,
  Stack,
  Button,
  hubspot,
} from '@hubspot/ui-extensions';

const IgnisignCard = () => {
  return (
    <Stack distance="medium">
      <Heading>Ignisign Digital Signature</Heading>
      <Text>
        Welcome to the Ignisign Digital Signature integration.
      </Text>
      <Button>
        Request Signature
      </Button>
    </Stack>
  );
};

// Register the extension
hubspot.extend(() => <IgnisignCard />); 