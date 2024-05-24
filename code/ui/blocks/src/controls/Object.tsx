import { global } from '@storybook/global';
import cloneDeep from 'lodash/cloneDeep.js';
import type { ComponentProps, SyntheticEvent, FC, FocusEvent } from 'react';
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { styled, useTheme, type Theme } from '@storybook/theming';
import { Form, IconButton, Button } from '@storybook/components';
import { AddIcon, EyeCloseIcon, EyeIcon, SubtractIcon } from '@storybook/icons';
import { JsonTree } from './react-editable-json-tree';
import { getControlId, getControlSetterButtonId } from './helpers';
import type { ControlProps, ObjectValue, ObjectConfig } from './types';

const { window: globalWindow } = global;

type JsonTreeProps = ComponentProps<typeof JsonTree>;

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',

  '&[aria-readonly="true"]': {
    opacity: 0.5,
  },

  '.rejt-tree': {
    marginLeft: '0.1 rem',
    fontSize: '13px',
  },
  '.rejt-value-node, .rejt-object-node > .rejt-collapsed, .rejt-array-node > .rejt-collapsed, .rejt-object-node > .rejt-not-collapsed, .rejt-array-node > .rejt-not-collapsed':
    {
      '& > svg': {
        opacity: 0,
        transition: 'opacity 0.2s',
      },
    },
  '.rejt-value-node:hover, .rejt-object-node:hover > .rejt-collapsed, .rejt-array-node:hover > .rejt-collapsed, .rejt-object-node:hover > .rejt-not-collapsed, .rejt-array-node:hover > .rejt-not-collapsed':
    {
      '& > svg': {
        opacity: 1,
      },
    },
  '.rejt-edit-form button': {
    display: 'none',
  },
  '.rejt-add-form': {
    marginLeft: 10,
  },
  '.rejt-add-value-node': {
    display: 'inline-flex',
    alignItems: 'center',
  },
  '.rejt-name': {
    lineHeight: '22px',
  },
  '.rejt-not-collapsed-delimiter': {
    lineHeight: '22px',
  },
  '.rejt-plus-menu': {
    marginLeft: 5,
  },
  '.rejt-object-node > span > *, .rejt-array-node > span > *': {
    position: 'relative',
    zIndex: 2,
  },
  '.rejt-object-node, .rejt-array-node': {
    position: 'relative',
  },
  '.rejt-object-node > span:first-of-type::after, .rejt-array-node > span:first-of-type::after, .rejt-collapsed::before, .rejt-not-collapsed::before':
    {
      content: '""',
      position: 'absolute',
      top: 0,
      display: 'block',
      width: '100%',
      marginLeft: '-0.5rem',
      padding: '0 4px 0 1rem',
      height: 22,
    },
  '.rejt-collapsed::before, .rejt-not-collapsed::before': {
    zIndex: 1,
    background: 'transparent',
    borderRadius: 4,
    transition: 'background 0.2s',
    pointerEvents: 'none',
    opacity: 0.1,
  },
  '.rejt-object-node:hover, .rejt-array-node:hover': {
    '& > .rejt-collapsed::before, & > .rejt-not-collapsed::before': {
      background: theme.color.secondary,
    },
  },
  '.rejt-collapsed::after, .rejt-not-collapsed::after': {
    content: '""',
    position: 'absolute',
    display: 'inline-block',
    pointerEvents: 'none',
    width: 0,
    height: 0,
  },
  '.rejt-collapsed::after': {
    left: -6,
    top: 6,
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    borderLeft: '3px solid rgba(153,153,153,0.6)',
  },
  '.rejt-not-collapsed::after': {
    left: -8,
    top: 8,
    borderTop: '3px solid rgba(153,153,153,0.6)',
    borderLeft: '3px solid transparent',
    borderRight: '3px solid transparent',
  },
  '.rejt-value': {
    display: 'inline-block',
    border: '1px solid transparent',
    borderRadius: 4,
    margin: '1px 0',
    padding: '0 4px',
    cursor: 'text',
    color: theme.color.defaultText,
  },
  '.rejt-value-node:hover > .rejt-value': {
    background: theme.color.lighter,
    borderColor: theme.appBorderColor,
  },
}));

const FancyExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  margin: 5px;
  margin-top: 30px;
  margin-left: auto;
  margin-rigth: 0px;
  height: 30px;
  border: none;
  border-radius: 12px;
  background-color:  #00aaff;
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #0099cc;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 2px rgba(108, 92, 231, 0.5);
  }

  &:active {
    background-color: #0099cc;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonWithInput = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  margin: 5px;
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  height: 30px;
  border-radius: 12px;
  background-color: transparent;
  color: black;
  font-size: 8px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: default;

  input {
    width: 50px;
    margin-left: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 12px;
    text-align: center;
    -webkit-appearance: none; /* Remove default styling in Safari */
    -moz-appearance: textfield; /* Remove default styling in Firefox */
    appearance: textfield; /* Remove default styling in other browsers */
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0; /* Removes default margin */
  }
`;

const CheckButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 15px;
  margin-left: 5px;
  border: none;
  border-radius: 10%;
  background-color: #00aaff;
  color: white;
  font-size: 10px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #0099cc;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 2px rgba(108, 92, 231, 0.5);
  }

  &:active {
    background-color: #0099cc;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonInline = styled.button<{ primary?: boolean }>(({ theme, primary }) => ({
  border: 0,
  height: 20,
  margin: 1,
  borderRadius: 4,
  background: primary ? theme.color.secondary : 'transparent',
  color: primary ? theme.color.lightest : theme.color.dark,
  fontWeight: primary ? 'bold' : 'normal',
  cursor: 'pointer',
  order: primary ? 'initial' : 9,
}));

const ActionAddIcon = styled(AddIcon)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  display: 'inline-block',
  verticalAlign: 'middle',
  width: 15,
  height: 15,
  padding: 3,
  marginLeft: 5,
  cursor: disabled ? 'not-allowed' : 'pointer',
  color: theme.textMutedColor,
  '&:hover': disabled ? {} : { color: theme.color.ancillary },
  'svg + &': {
    marginLeft: 0,
  },
}));

const ActionSubstractIcon = styled(SubtractIcon)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  display: 'inline-block',
  verticalAlign: 'middle',
  width: 15,
  height: 15,
  padding: 3,
  marginLeft: 5,
  cursor: disabled ? 'not-allowed' : 'pointer',
  color: theme.textMutedColor,
  '&:hover': disabled ? {} : { color: theme.color.negative },
  'svg + &': {
    marginLeft: 0,
  },
}));

const Input = styled.input(({ theme, placeholder }) => ({
  outline: 0,
  margin: placeholder ? 1 : '1px 0',
  padding: '3px 4px',
  color: theme.color.defaultText,
  background: theme.background.app,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 4,
  lineHeight: '14px',
  width: placeholder === 'Key' ? 80 : 120,
  '&:focus': {
    border: `1px solid ${theme.color.secondary}`,
  },
}));

const RawButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  top: 2,
  right: 2,
  height: 21,
  padding: '0 3px',
  background: theme.background.bar,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 3,
  color: theme.textMutedColor,
  fontSize: '9px',
  fontWeight: 'bold',
  textDecoration: 'none',
  span: {
    marginLeft: 3,
    marginTop: 1,
  },
}));

const RawInput = styled(Form.Textarea)(({ theme }) => ({
  flex: 1,
  padding: '7px 6px',
  fontFamily: theme.typography.fonts.mono,
  fontSize: '12px',
  lineHeight: '18px',
  '&::placeholder': {
    fontFamily: theme.typography.fonts.base,
    fontSize: '13px',
  },
  '&:placeholder-shown': {
    padding: '7px 10px',
  },
}));

const ENTER_EVENT = { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13 };
const dispatchEnterKey = (event: SyntheticEvent<HTMLInputElement>) => {
  event.currentTarget.dispatchEvent(new globalWindow.KeyboardEvent('keydown', ENTER_EVENT));
};
const selectValue = (event: SyntheticEvent<HTMLInputElement>) => {
  event.currentTarget.select();
};

export type ObjectProps = ControlProps<ObjectValue> & ObjectConfig;

const getCustomStyleFunction: (theme: Theme) => JsonTreeProps['getStyle'] = (theme) => () => ({
  name: {
    color: theme.color.secondary,
  },
  collapsed: {
    color: theme.color.dark,
  },
  ul: {
    listStyle: 'none',
    margin: '0 0 0 1rem',
    padding: 0,
  },
  li: {
    outline: 0,
  },
});

export const ObjectControl: FC<ObjectProps> = ({ name, value, onChange, argType }) => {
  const theme = useTheme();
  const data = useMemo(() => value && cloneDeep(value), [value]);
  const hasData = data !== null && data !== undefined;
  const [showRaw, setShowRaw] = useState(!hasData);
  const [parseError, setParseError] = useState<Error>(null);
  const readonly = !!argType?.table?.readonly;
  const updateRaw: (raw: string) => void = useCallback(
    (raw) => {
      try {
        if (raw) onChange(JSON.parse(raw));
        setParseError(undefined);
      } catch (e) {
        setParseError(e);
      }
    },
    [onChange]
  );

  const [forceVisible, setForceVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNotCollapsed, setIsNotCollapsed] = useState(false);
  const [showOnlyOne, setShowOnlyOne] = useState(false);

  const [nodeCountUntil, setNodeCountUntil] = useState(0);
  const [nodeCountOnly, setNodeCountOnly] = useState(0);
  const [nodeToShowDown, setNodeToShowDown] = useState(0);

  const [nodeToShowUp, setNodeToShowUp] = useState(10);

  const totalNodes = Array.isArray(data) ? data.length : Object.keys(data).length;

  const onForceVisible = useCallback(() => {
    onChange({});
    setForceVisible(true);
  }, [setForceVisible]);

  const htmlElRef = useRef(null);

  useEffect(() => {
    if (forceVisible && htmlElRef.current) htmlElRef.current.select();
  }, [forceVisible]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
        const newExpanded = !prev;
        setNodeToShowUp(newExpanded ? totalNodes : 10);
        setNodeToShowDown(0);
        setShowOnlyOne(false);
        return newExpanded;
    });
  }, [totalNodes]);

  const handleSaveUntil = useCallback(() => {
    setShowOnlyOne(false);
    setNodeToShowUp(nodeCountUntil);
    setNodeToShowDown(0);
  }, [nodeCountUntil]);

  const handleSaveOnly = useCallback(() => {
    setShowOnlyOne(true);
  }, [nodeCountOnly]);

  if (!hasData) {
    return (
      <Button disabled={readonly} id={getControlSetterButtonId(name)} onClick={onForceVisible}>
        Set object
      </Button>
    );
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsNotCollapsed(document.querySelector('.rejt-not-collapsed') !== null);
    }, 1);

    return () => clearInterval(intervalId);
  }, []);

  const displayedData = useMemo(() => {
    console.log(`Only one = ${showOnlyOne}`);
    console.log(`Expande = ${isExpanded}`);
    if(showOnlyOne) {

      if(Array.isArray(data)) {

        return { [nodeCountOnly]: data[nodeCountOnly] };
      } else {
        const key = Object.keys(data)[nodeCountOnly];

        return { [key]: data[key] };
      }
    }
    else if(isExpanded) {
      return data.slice(nodeToShowDown, nodeToShowUp);
    }
    else {
      if(Array.isArray(data)) {
        return data.slice(nodeToShowDown, nodeToShowUp);
      }
      else {
        return data;
      }
    }
  }, [data, showOnlyOne, nodeCountOnly, isExpanded, nodeToShowDown, nodeToShowUp]);

  const rawJSONForm = (
    <RawInput
      ref={htmlElRef}
      id={getControlId(name)}
      name={name}
      defaultValue={value === null ? '' : JSON.stringify(value, null, 2)}
      onBlur={(event: FocusEvent<HTMLTextAreaElement>) => updateRaw(event.target.value)}
      placeholder="Edit JSON string..."
      autoFocus={forceVisible}
      valid={parseError ? 'error' : null}
      readOnly={readonly}
    />
  );

  const isObjectOrArray =
    Array.isArray(value) || (typeof value === 'object' && value?.constructor === Object);

  return (
    <>
      {!showRaw && isNotCollapsed &&(
        <>
          <ButtonWithInput>
            See only node
            <input
              type="number"
              value={nodeCountOnly}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setNodeCountOnly(Math.min(Math.max(value, 0), totalNodes));
              }}
              min="0"
              max={totalNodes}
            />
            <CheckButton onClick={handleSaveOnly} primary>
              Save
            </CheckButton>
          </ButtonWithInput>
          <ButtonWithInput>
            See until node
            <input
              type="number"
              value={nodeCountUntil}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setNodeCountUntil(Math.min(Math.max(value, 0), totalNodes));
              }}
              min="0"
              max={totalNodes}
            />
            <CheckButton onClick={handleSaveUntil} primary>
              Save
            </CheckButton>
          </ButtonWithInput>
        </>
      )}
      <Wrapper aria-readonly={readonly}>
        {isObjectOrArray && (
          <RawButton
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              setShowRaw((v) => !v);
              setShowOnlyOne(false);
            }}
          >
            {showRaw ? <EyeCloseIcon /> : <EyeIcon />}
            <span>RAW</span>
          </RawButton>
        )}
        {!showRaw ? (
          <>
            <JsonTree
              readOnly={readonly || !isObjectOrArray}
              isCollapsed={isObjectOrArray ? /* default value */ undefined :  () => true}
              data={isNotCollapsed ? displayedData : data}
              rootName={name}
              onFullyUpdate={onChange}
              getStyle={getCustomStyleFunction(theme)}
              cancelButtonElement={<ButtonInline type="button">Cancel</ButtonInline>}
              editButtonElement={<ButtonInline type="submit">Save</ButtonInline>}
              addButtonElement={
                <ButtonInline type="submit" primary>
                  Save
                </ButtonInline>
              }
              plusMenuElement={<ActionAddIcon />}
              minusMenuElement={<ActionSubstractIcon />}
              inputElement={(_: any, __: any, ___: any, key: string) =>
                key ? <Input onFocus={selectValue} onBlur={dispatchEnterKey} /> : <Input />
              }
              fallback={rawJSONForm}
            />
            {isNotCollapsed && isExpanded && (
              <FancyExpandButton onClick={toggleExpand}>
                Show few
              </FancyExpandButton>
            )}
            {isNotCollapsed && !isExpanded && (
              <FancyExpandButton onClick={toggleExpand}>
                Show all
              </FancyExpandButton>
            )}
          </>
        ) : (
          rawJSONForm
        )}
      </Wrapper>
    </>
  );
};
