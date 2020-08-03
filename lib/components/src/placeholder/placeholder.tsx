import React, { Children, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

const Title = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
}));

const Desc = styled.div();

const Message = styled.div(({ theme }) => ({
  padding: 30,
  textAlign: 'center',
  color: theme.color.defaultText,
  fontSize: theme.typography.size.s2 - 1,
}));

interface PlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const Placeholder: FunctionComponent<PlaceholderProps> = ({
  children,
  className,
  ...props
}) => {
  const [title, desc] = Children.toArray(children);
  return (
    <Message className={className} {...props}>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
    </Message>
  );
};
