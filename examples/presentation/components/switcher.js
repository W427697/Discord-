import React, { useState, Children, cloneElement } from 'react';

import { AccordionItem, AccordionContents } from './accordion/common';

const Switcher = ({ initial, children }) => {
  const [actives, setActives] = useState(initial);
  const toggle = index => {
    const l = actives.slice();
    l[index] = !l[index];
    setActives(l);
  };

  return children({ actives, setActives, toggle });
};

const Expander = ({ active, onClick, children }) => {
  const content = Children.toArray(children);
  const b = content[0];

  return (
    <AccordionItem direction="vertical">
      {cloneElement(b, { active, onClick }, b.props.children)}
      <AccordionContents isOpen={active}>{content[1]}</AccordionContents>
    </AccordionItem>
  );
};

export { Switcher as default, Expander };
