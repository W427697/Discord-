import React, { FC, useEffect } from 'react';
import { ArgsTable, NoControlsWarning } from '@storybook/components';
import { useArgs, useArgTypes, useParameter } from '@storybook/api';
import { getQueryParams } from '@storybook/client-api';

import { PARAM_KEY } from '../constants';

const controlsValuesFromUrl: Record<string, string> = Object.entries(getQueryParams())
  .filter((key) => {
    return key[0]?.includes('control-');
  })
  .reduce((acc, [key, value]) => {
    const argName = key.replace('control-', '');
    return { ...acc, [argName]: value };
  }, {});

interface ControlsParameters {
  expanded?: boolean;
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs, resetArgs] = useArgs();
  const rows = useArgTypes();
  const isArgsStory = useParameter<boolean>('__isArgsStory', false);
  const { expanded, hideNoControlsWarning = false } = useParameter<ControlsParameters>(
    PARAM_KEY,
    {}
  );
  const hasControls = Object.values(rows).filter((argType) => !!argType?.control).length > 0;

  useEffect(() => {
    if (Object.keys(controlsValuesFromUrl).length > 0) {
      updateArgs(controlsValuesFromUrl);
    }
  }, []);

  return (
    <>
      {(hasControls && isArgsStory) || hideNoControlsWarning ? null : <NoControlsWarning />}
      <ArgsTable
        {...{
          compact: !expanded && hasControls,
          rows,
          args,
          updateArgs,
          resetArgs,
          inAddonPanel: true,
        }}
      />
    </>
  );
};
