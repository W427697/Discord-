import React, { ComponentProps } from 'react';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';

const sharedStyles = {
  height: '10px',
  width: '10px',
  marginLeft: '-5px',
  marginRight: '-5px',
  display: 'block',
};

const Icon = styled(Icons)(sharedStyles, ({ theme }) => ({ color: theme.color.secondary }));
const Img = styled.img(sharedStyles);
const Placeholder = styled.div(sharedStyles);

export interface ListItemIconProps {
  icon?: ComponentProps<typeof Icons>['icon'];
  imgSrc?: string;
}

const ListItemIcon = ({ icon, imgSrc }: ListItemIconProps) => {
  if (icon) {
    return <Icon icon={icon} />;
  }
  if (imgSrc) {
    return <Img src={imgSrc} alt="image" />;
  }
  return <Placeholder />;
};

export default ListItemIcon;
