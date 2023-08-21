import type { FC } from 'react';
import React, { useCallback, useState, useEffect } from 'react';

import type { API, Addon } from '@storybook/manager-api';
import { types } from '@storybook/manager-api';

import type { Addon_Collection, Addon_Type } from '@storybook/types';

import { Link } from '@storybook/components/experimental';
import {
  BooleanControl,
  ColorControl,
  DateControl,
  FilesControl,
  NumberControl,
  ObjectControl,
  OptionsControl,
  RangeControl,
  TextControl,
} from '../../controls';
import type { Args, ArgType } from './types';

export interface ArgControlProps {
  api: API;
  row: ArgType;
  arg: any;
  updateArgs: (args: Args) => void;
  isHovered: boolean;
}

export const getControls = (getFn: API['getElements']): Addon_Collection =>
  getFn<Addon>(types.CONTROL);

interface ControlCollection {
  [key: string]: FC | Addon_Type['render'];
}

const DefaultControls: ControlCollection = {
  array: ObjectControl,
  object: ObjectControl,
  boolean: BooleanControl,
  color: ColorControl,
  date: DateControl,
  number: NumberControl,
  check: OptionsControl,
  'inline-check': OptionsControl,
  radio: OptionsControl,
  'inline-radio': OptionsControl,
  select: OptionsControl,
  'multi-select': OptionsControl,
  range: RangeControl,
  text: TextControl,
  file: FilesControl,
};

const useControls = (api: API): ControlCollection => {
  const addons = getControls(api.getElements);
  const controlKeys = Object.keys(addons);
  const controlRenderers = controlKeys.reduce((acc: ControlCollection, key: string) => {
    return { ...acc, [key]: addons[key].render as FC };
  }, {});

  return {
    ...DefaultControls,
    ...controlRenderers,
  };
};

const NoControl = () => <>-</>;

export const ArgControl: FC<ArgControlProps> = ({ api, row, arg, updateArgs, isHovered }) => {
  const { key, control } = row;

  const Controls = useControls(api);

  const [isFocused, setFocused] = useState(false);
  // box because arg can be a fn (e.g. actions) and useState calls fn's
  const [boxedValue, setBoxedValue] = useState({ value: arg });

  useEffect(() => {
    if (!isFocused) setBoxedValue({ value: arg });
  }, [isFocused, arg]);

  const onChange = useCallback(
    (argVal: any) => {
      setBoxedValue({ value: argVal });
      updateArgs({ [key]: argVal });
      return argVal;
    },
    [updateArgs, key]
  );

  const onBlur = useCallback(() => setFocused(false), []);
  const onFocus = useCallback(() => setFocused(true), []);

  if (!control || control.disable)
    return isHovered ? (
      <Link
        href="https://storybook.js.org/docs/react/essentials/controls"
        target="_blank"
        withArrow
      >
        Setup controls
      </Link>
    ) : (
      <NoControl />
    );

  // row.name is a display name and not a suitable DOM input id or name - i might contain whitespace etc.
  // row.key is a hash key and therefore a much safer choice
  const props = { name: key, argType: row, value: boxedValue.value, onChange, onBlur, onFocus };
  const Control = Controls[control.type] || NoControl;
  return <Control api={api} {...props} {...control} controlType={control.type} />;
};
