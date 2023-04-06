import type { FC } from 'react';
import React from 'react';
import type { NormalizedToolbarArgTypeText } from '../types';

type ToolbarTextInputProps = NormalizedToolbarArgTypeText;

export const ToolbarTextInput: FC<ToolbarTextInputProps> = ({
  id,
  name,
  description,
  toolbar: { title },
}) => {
  return (
    <p>
      {name} {title}
    </p>
  );
};
