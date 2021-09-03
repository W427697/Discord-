import React, { FunctionComponent } from 'react';

const List: FunctionComponent<unknown> = ({ children }) => {
  return <ul>{children}</ul>;
};

export default List;
