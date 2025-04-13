import React from 'react';
import { clsx } from 'clsx';

export function Card({ className, children, ...props }) {
  return (
    <div className={clsx('rounded-lg border bg-white text-black shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={clsx('p-4 border-b', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h2 className={clsx('text-lg font-semibold', className)} {...props}>
      {children}
    </h2>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={clsx('text-sm text-gray-500', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx('p-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={clsx('p-4 border-t', className)} {...props}>
      {children}
    </div>
  );
}
