import React from 'react';
import { Accordion } from './base';
import { AccordionButton, AccordionItem, AccordionContents, Indicator } from './common';

function RightAccordion({ items, ...props }) {
  return (
    <Accordion {...props}>
      {({ openIndexes, handleItemClick }) => (
        <div>
          {items.map((item, index) => (
            <AccordionItem key={item.title} direction="horizontal">
              <AccordionButton
                style={{ minWidth: 10 }}
                isOpen={openIndexes.includes(index)}
                onClick={() => handleItemClick(index)}
              >
                <Indicator>{openIndexes.includes(index) ? '📂' : '📁'}</Indicator> {item.title}
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

export { RightAccordion };
