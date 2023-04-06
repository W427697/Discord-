import React, { type FC, useEffect, useCallback, type ChangeEventHandler } from 'react';
import { useGlobals } from '@storybook/manager-api';
import { Icons, TooltipMessage, WithTooltip } from '@storybook/components';
import type { NormalizedToolbarArgTypeText } from '../types';

type ToolbarTextInputProps = NormalizedToolbarArgTypeText;

export const ToolbarTextInput: FC<ToolbarTextInputProps> = ({
  id,
  name,
  description,
  toolbar: { icon, title, defaultValue, isSecret },
}) => {
  const [globals, updateGlobals] = useGlobals();
  const currentValue = globals[id];
  useEffect(() => {
    if (currentValue == null) updateGlobals({ [id]: defaultValue });
  });

  const handleInputChange = useCallback(
    (e) => {
      const value = e?.target?.value;
      if (value != null) updateGlobals({ [id]: value });
    },
    [updateGlobals]
  ) as ChangeEventHandler<HTMLInputElement>;

  return (
    <WithTooltip tooltip={<TooltipMessage title={title} desc={description} />}>
      {icon && <Icons icon={icon} />}
      {title ? `\xa0${title}` : `\xa0${name}`}
      <input
        type={isSecret ? 'password' : 'text'}
        value={currentValue}
        onChange={handleInputChange}
      />
    </WithTooltip>
  );
};
