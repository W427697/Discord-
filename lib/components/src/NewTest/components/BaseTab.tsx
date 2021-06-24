import React, { FC, HTMLAttributes, useCallback, useContext, useEffect } from 'react';
import { TabsButton } from '../TabsButton';
import { TabProps } from '../types';
import { Icons } from '../../icon/icon';
import { TabsBarContext } from '../TabsBarContext';
import { sanitizeTabProps } from '../utils/sanitize-tab-props';

type BaseTabProps = TabProps & HTMLAttributes<HTMLButtonElement>;

export const BaseTab: FC<BaseTabProps> = (props) => {
  const { tabProps, htmlProps: rest } = sanitizeTabProps({
    ...props,
    // eslint-disable-next-line react/destructuring-assignment
    type: props.type || 'content',
  });
  const { active, id, label, icon, Icon } = tabProps;
  const { addToMap, removeFromMap, onSelect, selectedTabId } = useContext(TabsBarContext);

  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  useEffect(() => {
    addToMap(tabProps);

    return () => {
      removeFromMap(tabProps);
    };
  }, []);

  let ButtonIcon = Icon;

  if (icon) {
    ButtonIcon = <Icons icon={icon} />;
  }

  return (
    <TabsButton id={id} active={active || selectedTabId === id} {...rest} onClick={handleClick}>
      {ButtonIcon}
      {label}
    </TabsButton>
  );
};
