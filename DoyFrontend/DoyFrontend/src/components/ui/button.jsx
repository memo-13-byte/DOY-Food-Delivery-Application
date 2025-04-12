import React from 'react';
import { clsx } from 'clsx';

// Button variants that can be used
const buttonVariants = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  destructive: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'bg-transparent border border-gray-300 hover:bg-gray-100',
  link: 'bg-transparent underline-offset-4 hover:underline text-amber-500 hover:bg-transparent',
};

const buttonSizes = {
  sm: 'text-sm h-8 px-3',
  md: 'text-base h-10 px-4',
  lg: 'text-lg h-12 px-6',
};

const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? 'slot' : 'button';
  
  return (
    <Comp
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:pointer-events-none', 
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export { Button, buttonVariants };