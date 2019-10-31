import React from 'react';
import styled from '@emotion/styled';

import { StandardAccordion } from './standard';
import { AboveAccordion } from './above';
import { RightAccordion } from './right';
import { LeftAccordion } from './left';
import { SingleAccordion } from './single';
import { PreventCloseAccordion } from './prevent-close';
import { SinglePreventCloseAccordion } from './single-prevent-close';

const PlaceHolder = styled.div(({ color }) => ({
  height: 100,
  textAlign: 'center',
  lineHeight: '100px',
  color,
  padding: 20,
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.4)',
}));

export const items = [
  {
    title: 'item 1: pink',
    contents: <PlaceHolder color="hotpink">hotpink content here...</PlaceHolder>,
  },
  {
    title: 'item 2: blue',
    contents: <PlaceHolder color="deepskyblue">deepskyblue content here...</PlaceHolder>,
  },
  {
    title: 'item 3: orange',
    contents: <PlaceHolder color="orangered">orangered content here...</PlaceHolder>,
  },
];

function asImpl(Comp) {
  return props => (
    <div
      style={{
        width: 400,
        fontSize: 18,
        textAlign: 'left',
        margin: 'auto',
      }}
    >
      <Comp items={items} {...props} />
    </div>
  );
}

export const Standard = asImpl(StandardAccordion);
export const Above = asImpl(AboveAccordion);
export const Right = asImpl(RightAccordion);
export const Left = asImpl(LeftAccordion);
export const Single = asImpl(SingleAccordion);
export const PreventClose = asImpl(PreventCloseAccordion);
export const SinglePreventClose = asImpl(SinglePreventCloseAccordion);
