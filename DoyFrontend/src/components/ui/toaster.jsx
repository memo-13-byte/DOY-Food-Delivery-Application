import React from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-background text-foreground border border-border shadow-md',
        style: {
          padding: '1rem',
          borderRadius: '0.375rem',
        },
        success: {
          className: 'bg-background text-foreground border border-border shadow-md',
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'white',
          },
        },
        error: {
          className: 'bg-background text-foreground border border-border shadow-md',
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'white',
          },
        },
      }}
    />
  );
}