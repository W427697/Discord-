import React from 'react';
import { AccordionList as AccordionListProxy } from './AccordionList';
import { AccordionItem } from '../Accordion/AccordionItem';
import { AccordionHeader } from '../Accordion/AccordionHeader';
import { AccordionBody } from '../Accordion/AccordionBody';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionListProps } from './AccordionList';

export default {
  title: 'Basics/AccordionList',
  component: AccordionListProxy,
} as Meta;

const Template: Story<AccordionListProps> = (args) => {
  return (
    <AccordionListProxy {...args}>
      <AccordionItem>
        <AccordionHeader>List Item #1</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>
          Mollit elit adipisicing est commodo nostrud laboris anim. Laboris in in proident nulla
          proident eiusmod non excepteur
        </AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #3</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #4</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #5</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #6</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #7</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #8</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #9</AccordionHeader>
        <AccordionBody>
          <div>
            Quis commodo Lorem commodo aute excepteur deserunt ad. Duis quis dolor do est pariatur
            aliqua ea incididunt. Consequat sunt et in proident dolore adipisicing incididunt ex.
          </div>
        </AccordionBody>
      </AccordionItem>
    </AccordionListProxy>
  );
};

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  allowMultipleOpen: true,
  bordered: true,
  rounded: true,
};

export const HeadersOnly: Story<AccordionListProps> = (args) => {
  return (
    <AccordionListProxy {...args}>
      <AccordionItem>
        <AccordionHeader>List Item #1</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>
          Mollit elit adipisicing est commodo nostrud laboris anim. Laboris in in proident nulla
          proident eiusmod non excepteur
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #3</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #4</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #5</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #6</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #7</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #8</AccordionHeader>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>List Item #9</AccordionHeader>
      </AccordionItem>
    </AccordionListProxy>
  );
};
HeadersOnly.args = {
  bordered: true,
  rounded: true,
};
