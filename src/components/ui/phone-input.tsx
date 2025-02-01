'use client';

import { forwardRef } from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';

export const PhoneInput = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, ...props }, ref) => {
    const formatPhoneNumber = (value: string) => {
      try {
        const formatter = new AsYouType('US');
        return formatter.input(value);
      } catch {
        return value;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '');
      const formatted = formatPhoneNumber(rawValue);
      
      if (onChange) {
        try {
          const parsed = parsePhoneNumber(formatted || '', 'US');
          const normalized = parsed?.formatInternational() || formatted;
          
          onChange({
            ...e,
            target: {
              ...e.target,
              value: normalized
            }
          });
        } catch {
          onChange({
            ...e,
            target: {
              ...e.target,
              value: formatted
            }
          });
        }
      }
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder="+1 (555) 123-4567"
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';