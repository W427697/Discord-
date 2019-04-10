import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

import { styled, withTheme } from '@storybook/theming';
import { StorybookLogo, WithTooltip, TooltipLinkList, Button, Icons } from '@storybook/components';

const BrandArea = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
  marginRight: theme.layoutMargin,
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  paddingTop: 3,
  paddingBottom: 3,
  minHeight: 28,
  '& > *': {
    maxWidth: '100%',
    height: 'auto',
    width: 'auto',
    display: 'block',
  },
}));

const Logo = styled(StorybookLogo)({
  width: 'auto',
  height: 22,
  display: 'block',
});

const Img = styled.img({
  width: 'auto',
  height: '100%',
  display: 'block',
  maxWidth: '100%',
});

const LogoLink = styled.a({
  display: 'block',
  width: '100%',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

const MenuButton = styled(Button)(props => ({
  position: 'relative',
  overflow: 'visible',
  padding: 7,

  ...(props.highlighted && {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 8,
      background: `${props.theme.color.positive}`,
    },
  }),
}));

const Head = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

const Brand = withTheme(({ theme: { brand } }) => {
  const { image, url } = brand;
  const defaultTitle = 'Storybook';
  const defaultUrl = './';
  const title = brand.title || defaultTitle;
  const targetValue = url ? '_blank' : '';
  if (image && url) {
    return (
      <LogoLink href={url} target={targetValue}>
        <Img src={image} alt={title} />
      </LogoLink>
    );
  }
  if (image && url === null) {
    return <Img src={image} alt={title} />;
  }
  if (image && typeof url === 'undefined') {
    return (
      <LogoLink href={defaultUrl} target={targetValue}>
        <Img src={image} alt={title} />
      </LogoLink>
    );
  }
  if (!image && url) {
    return (
      <LogoLink href={url} target={targetValue}>
        {title}
      </LogoLink>
    );
  }
  if (!image && url === null) {
    return brand.title || <Logo alt={defaultTitle} />;
  }
  if (!image && typeof url === 'undefined') {
    return (
      <LogoLink href={defaultUrl} target={targetValue}>
        {brand.title || <Logo alt={defaultTitle} />}
      </LogoLink>
    );
  }
  return null;
});

const SidebarHeading = withState('tooltipShown', 'onVisibilityChange', false)(
  ({ menuHighlighted, menu, tooltipShown, onVisibilityChange, ...props }) => (
    <Head {...props}>
      <BrandArea>
        <Brand />
      </BrandArea>

      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={tooltipShown}
        onVisibilityChange={onVisibilityChange}
        tooltip={
          <TooltipLinkList
            links={menu.map(i => ({
              ...i,
              onClick: (...args) => onVisibilityChange(false) || i.onClick(...args),
            }))}
          />
        }
        closeOnClick
      >
        <MenuButton outline small containsIcon highlighted={menuHighlighted} title="Shortcuts">
          <Icons icon="ellipsis" />
        </MenuButton>
      </WithTooltip>
    </Head>
  )
);
SidebarHeading.propTypes = {
  menuHighlighted: PropTypes.bool,
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

SidebarHeading.defaultProps = {
  menuHighlighted: false,
};

export { SidebarHeading as default };
