declare module '@hubspot/ui-extensions' {
  import { ReactNode, ChangeEvent } from 'react';

  export interface ButtonProps {
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    children: ReactNode;
  }

  export interface InputProps {
    label?: string;
    name: string;
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
    onInput?: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
    type?: string;
    required?: boolean;
    multiple?: boolean;
  }

  export interface SelectProps {
    label?: string;
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    options: Array<{ label: string; value: string }>;
  }

  export interface TextProps {
    children: ReactNode;
  }

  export const Button: React.FC<ButtonProps>;
  export const Input: React.FC<InputProps>;
  export const Select: React.FC<SelectProps>;
  export const Text: React.FC<TextProps>;
  export const Form: React.FC<{ children: ReactNode }>;
  export const Divider: React.FC;

  export const hubspot: {
    contact: {
      setProperty: (contactId: string, propertyName: string, value: string) => Promise<void>;
    };
    ui: {
      showToast: (options: { message: string; type: 'success' | 'error' }) => void;
    };
  };
} 