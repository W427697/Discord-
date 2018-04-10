import PropTypes from 'prop-types';
import React from 'react';
// import { baseFonts } from '@storybook/components';
import socialsNetworks from './SocialNetworks';
import { Container, Logo, Shortcuts, SocialsNetworks } from './Styled';

const Header = ({ openShortcutsHelp, name, url, enableShortcutsHelp }) => (
  <Container>
    <Logo href={url} target="_blank" rel="noopener noreferrer" title={name.full}>
      <h3>{name.short}</h3>
    </Logo>
    {socialsNetworks.map(sn => {
      const Svg = sn.svg;
      return (
        <SocialsNetworks key={sn.name} title={sn.name} href={sn.link} target="_blank">
          <Svg />
        </SocialsNetworks>
      );
    })}
    {enableShortcutsHelp && (
      <Shortcuts onClick={openShortcutsHelp} title="Shortcuts">
        ⌘
      </Shortcuts>
    )}
  </Container>
);

Header.defaultProps = {
  openShortcutsHelp: null,
  enableShortcutsHelp: true,
  name: {
    short: '',
    full: '',
  },
  url: '',
};

Header.propTypes = {
  openShortcutsHelp: PropTypes.func,
  name: PropTypes.shape({}),
  url: PropTypes.string,
  enableShortcutsHelp: PropTypes.bool,
};

export default Header;
