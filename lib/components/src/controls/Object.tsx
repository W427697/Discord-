import React, { FC, useCallback } from 'react';
import { styled } from '@storybook/theming';

import deepEqual from 'fast-deep-equal';
import ReactJson from 'react-json-view';
import type { InteractionProps } from 'react-json-view';
import { ControlProps, ObjectValue, ObjectConfig } from './types';

const Wrapper = styled.label({
  display: 'flex',
});

export type ObjectProps = ControlProps<ObjectValue> & ObjectConfig;
export const ObjectControl: FC<ObjectProps> = ({
  name,
  value,
  onChange,
  // ReactJSON Props
  iconStyle = 'triangle',
  indentWidth = 4,
  collapsed = false,
  collapseStringsAfterLength = false as false,
  groupArraysAfterLength = 100,
  enableClipboard = true,
  displayObjectSize = true,
  displayDataTypes = true,
}) => {
  const handleChange = useCallback(
    (payload: InteractionProps) => {
      // Compare just the modified value, but if accepted, refresh whole tree.
      if (!deepEqual(payload.existing_value, payload.new_value)) {
        onChange(payload.updated_src);
      }
    },
    [onChange]
  );

  return (
    <Wrapper>
      <ReactJson
        name={name}
        src={value}
        onEdit={handleChange}
        // NOT documenting/exposing the "theme" property as we would like to
        // tree-shake unused themes in future for bundle weight optimization.
        iconStyle={iconStyle}
        indentWidth={indentWidth}
        collapsed={collapsed}
        collapseStringsAfterLength={collapseStringsAfterLength}
        groupArraysAfterLength={groupArraysAfterLength}
        enableClipboard={enableClipboard}
        displayObjectSize={displayObjectSize}
        displayDataTypes={displayDataTypes}
      />
    </Wrapper>
  );
};
