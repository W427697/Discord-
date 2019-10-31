// import React from 'react';
import styled from '@emotion/styled';

const Avatar = styled.span(({ src, size = 5, color = 'white' }) => ({
  display: 'inline-block',
  borderRadius: '50%',
  border: `${size}px solid ${color}`,
  backgroundImage: `url(${src})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  width: 20 * size,
  height: 20 * size,
}));

export { Avatar as default };
