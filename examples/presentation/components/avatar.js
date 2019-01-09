// import React from 'react';
import styled from '@emotion/styled';

const Avatar = styled.span(({ src, size = 5, theme, color = 'white' }) => ({
  display: 'inline-block',
  borderRadius: '50%',
  border: `${size}px solid ${color}`,
  backgroundImage: `url(${src})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  width: theme.layoutMargin * size,
  height: theme.layoutMargin * size,
}));

export { Avatar as default };
