import React from 'react';
import ReactDOM from 'react-dom/client';
import { IgnisignCard } from '../components/crm/IgnisignCard';
import { hubspot } from '@hubspot/ui-extensions';

// Mock data for development
const mockContact = {
  email: 'john.doe@example.com',
  firstname: 'John',
  lastname: 'Doe',
};

const mockConfig = {
  apiKey: 'your-api-key',
  apiUrl: 'https://api.ignisign.io/v4',
};

// Initialize the development environment
hubspot.extend(() => (
  <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
    <IgnisignCard contact={mockContact} config={mockConfig} />
  </div>
)); 