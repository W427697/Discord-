import React from 'react';
import { Accordion } from './base';
import { AccordionButton, AccordionItem, AccordionContents, Indicator } from './common';

function StandardAccordion({ items, ...props }) {
  return (
    <Accordion {...props}>
      {({ openIndexes, handleItemClick }) => (
        <div>
          {items.map((item, index) => (
            <AccordionItem key={item.title} direction="vertical">
              <AccordionButton
                isOpen={openIndexes.includes(index)}
                onClick={() => handleItemClick(index)}
              >
                <Indicator>{openIndexes.includes(index) ? '➕' : '➖'}</Indicator> {item.title}
              </AccordionButton>
              <AccordionContents isOpen={openIndexes.includes(index)}>
                {item.contents}
              </AccordionContents>
            </AccordionItem>
          ))}
        </div>
      )}
    </Accordion>
  );
}

export { StandardAccordion };
