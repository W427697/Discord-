import type { FC } from 'react';
import React, { useCallback, useState, useEffect } from 'react';

import { Link } from '@storybook/components';
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
  row: ArgType;
  arg: any;
  updateArgs: (args: Args) => void;
  isHovered: boolean;
}

const Controls: Record<string, FC> = {
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

const NoControl = () => <>-</>;

export const ArgControl: FC<ArgControlProps> = ({ row, arg, updateArgs, isHovered }) => {
  const { key, control } = row;

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

  const controls = getControlTypesFromArgType(row);

  const tsTypes: string[] =
    row.type?.name === 'union'
      ? row.type.value.map((t: { name: any }) => t.name)
      : [row.type?.name];

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {controls.map((controlType: string) => {
        const UninonControl = Controls[controlType] || NoControl;
        const argValueType = typeof boxedValue.value;
        const controlValue = [tsTypes.shift(), controlType].includes(argValueType)
          ? boxedValue.value
          : undefined;

        const controlKey = controls.length > 1 ? `${controlType}-${key}` : key;

        return (
          <UninonControl
            {...props}
            {...control}
            key={controlKey}
            name={controlKey}
            value={controlValue}
            controlType={controlType}
          />
        );
      })}
    </div>
  );
};
/**
 * function to get control types from union arg type
 * example : argType = { name: 'union', value: [{ name: 'string' }, { name: 'number' }] }
 * @param argType
 * @returns
 */
function getControlTypesFromArgType(argType: ArgType) {
  return argType.type?.value && argType.type?.name === 'union' && !argType.options
    ? argType.type.value.map((t: { name: any }) => {
        switch (t.name) {
          case 'string':
            return 'text';

          default:
            return t.name;
        }
      })
    : [argType.control.type];
}
