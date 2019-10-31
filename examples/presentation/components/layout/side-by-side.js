import React, { Children } from 'react';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',

  '@media screen and (min-width: 600px)': {
    flexDirection: 'row',
  },
  '@media screen and (max-width: 599px)': {
    flexDirection: 'column',
  },
});
const Left = styled.div({
  '@media screen and (max-width: 599px)': {
    width: 210,
  },
});
const Right = styled.div({
  '@media screen and (min-width: 600px)': {
    flex: 1,
  },
});

const Layout1 = ({ children }) => {
  const content = Children.toArray(children);
  return (
    <Container>
      <Left>{content[0]}</Left>
      <Right>{content[1]}</Right>
    </Container>
  );
};

export { Layout1 as default };
