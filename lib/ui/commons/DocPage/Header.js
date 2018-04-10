import React from 'react';
import PropsTypes from 'prop-types';
import { Section, Title, SubTitle } from './Styled';

const Header = ({ name, description }) => (
  <Section>
    <Title>{name}</Title>
    <SubTitle>{description}</SubTitle>
  </Section>
);

Header.defaultProps = {
  name: '',
  description: '',
};

Header.propTypes = {
  name: PropsTypes.string,
  description: PropsTypes.string,
};

export default Header;
