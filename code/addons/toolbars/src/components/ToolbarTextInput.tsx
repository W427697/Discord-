import React, { type FC, useEffect, useCallback, type ChangeEventHandler, useState } from 'react';
import { useGlobals } from '@storybook/manager-api';
import { TooltipMessage, WithTooltip } from '@storybook/components';
import { ToolbarMenuButton } from './ToolbarMenuButton';
import type { NormalizedToolbarArgTypeText } from '../types';

type ToolbarTextInputProps = NormalizedToolbarArgTypeText;

export const ToolbarTextInput: FC<ToolbarTextInputProps> = ({
  id,
  description,
  toolbar: { icon, title, defaultValue, isSecret },
}) => {
  const [globals, updateGlobals] = useGlobals();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const currentValue = globals[id];
  const hasGlobalValue = Boolean(currentValue);
  useEffect(() => {
    if (currentValue == null) updateGlobals({ [id]: defaultValue });
  });

  const handleInputChange = useCallback(
    (e) => {
      const value = e?.target?.value;
      if (value != null) updateGlobals({ [id]: value });
    },
    [updateGlobals, id]
  ) as ChangeEventHandler<HTMLInputElement>;

  return (
    <WithTooltip
      closeOnOutsideClick
      onVisibleChange={setIsTooltipVisible}
      tooltip={<TooltipMessage title={title} desc={description} />}
    >
      <ToolbarMenuButton
        active={isTooltipVisible || hasGlobalValue}
        description={description ?? ''}
        icon={icon}
        title={title ?? ''}
      />
      <input
        type={isSecret ? 'password' : 'text'}
        value={currentValue}
        onChange={handleInputChange}
      />
    </WithTooltip>
  );
};
