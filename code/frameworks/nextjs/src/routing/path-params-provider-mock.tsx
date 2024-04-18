import React from 'react';

// The mock is used for Next.js < 14.2, where the PathParamsProvider doesn't exist
export const PathParamsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};
