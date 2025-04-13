import React from 'react';

export const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  return (
    <h1 className={`font-bold text-primary ${sizes[size]}`}>
      DOY
    </h1>
  );
};
