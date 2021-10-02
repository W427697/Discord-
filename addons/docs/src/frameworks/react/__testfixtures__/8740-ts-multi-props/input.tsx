import React from 'react';

export interface ElemAProps {
  size?: 'a' | 'b' | 'c' | 'd';
}

export const Header: React.FC<ElemAProps> = ({ size = 'a', children }) => (
  <div className={size}>{children}</div>
);

export interface ElemBProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Paragraph: React.FC<ElemBProps> = ({ size, children }) => (
  <div className={size}>{children}</div>
);

Paragraph.defaultProps = { size: 'md' };

export const component = Header;
