import type { FC } from 'react';
import React, { useState, Fragment, useCallback, useMemo, memo } from 'react';
import memoize from 'memoizerific';

import { useParameter, useGlobals } from '@storybook/manager-api';
import { logger } from '@storybook/core/dist/client-logger';
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PhotoIcon } from '@storybook/icons';
import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';
import { ColorIcon } from '../components/ColorIcon';
import type {
  BackgroundSelectorItem,
  Background,
  BackgroundsParameter,
  GlobalState,
} from '../types';
import { getBackgroundColorByName } from '../helpers';

const createBackgroundSelectorItem = memoize(1000)(
  (
    id: string | null,
    name: string,
    value: string,
    hasSwatch: boolean | null,
    change: (arg: { selected: string; name: string }) => void,
    active: boolean
  ): BackgroundSelectorItem => ({
    id: id || name,
    title: name,
    onClick: () => {
      change({ selected: value, name });
    },
    value,
    right: hasSwatch ? <ColorIcon background={value} /> : undefined,
    active,
  })
);

const getDisplayedItems = memoize(10)((
  backgrounds: Background[],
  selectedBackgroundColor: string | null,
  change: (arg: { selected: string; name: string }) => void
) => {
  const backgroundSelectorItems = backgrounds.map(({ name, value }) =>
    createBackgroundSelectorItem(null, name, value, true, change, value === selectedBackgroundColor)
  );

  if (selectedBackgroundColor !== 'transparent') {
    return [
      createBackgroundSelectorItem('reset', 'Clear background', 'transparent', null, change, false),
      ...backgroundSelectorItems,
    ];
  }

  return backgroundSelectorItems;
});

const DEFAULT_BACKGROUNDS_CONFIG: BackgroundsParameter = {
  default: null,
  disable: true,
  values: [],
};

export const BackgroundSelector: FC = memo(function BackgroundSelector() {
  const backgroundsConfig = useParameter<BackgroundsParameter>(
    BACKGROUNDS_PARAM_KEY,
    DEFAULT_BACKGROUNDS_CONFIG
  );
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [globals, updateGlobals] = useGlobals();

  const globalsBackgroundColor = globals[BACKGROUNDS_PARAM_KEY]?.value;

  const selectedBackgroundColor = useMemo(() => {
    return getBackgroundColorByName(
      globalsBackgroundColor,
      backgroundsConfig.values,
      backgroundsConfig.default
    );
  }, [backgroundsConfig, globalsBackgroundColor]);

  if (Array.isArray(backgroundsConfig)) {
    logger.warn(
      'Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md'
    );
  }

  const onBackgroundChange = useCallback(
    (value: string | undefined) => {
      updateGlobals({ [BACKGROUNDS_PARAM_KEY]: { ...globals[BACKGROUNDS_PARAM_KEY], value } });
    },
    [backgroundsConfig, globals, updateGlobals]
  );

  if (backgroundsConfig.disable) {
    return null;
  }

  return (
    <Fragment>
      <WithTooltip
        placement="top"
        closeOnOutsideClick
        tooltip={({ onHide }) => {
          return (
            <TooltipLinkList
              links={getDisplayedItems(
                backgroundsConfig.values,
                selectedBackgroundColor,
                ({ selected }: GlobalState) => {
                  if (selectedBackgroundColor !== selected) {
                    onBackgroundChange(selected);
                  }
                  onHide();
                }
              )}
            />
          );
        }}
        onVisibleChange={setIsTooltipVisible}
      >
        <IconButton
          key="background"
          title="Change the background of the preview"
          active={selectedBackgroundColor !== 'transparent' || isTooltipVisible}
        >
          <PhotoIcon />
        </IconButton>
      </WithTooltip>
    </Fragment>
  );
});
