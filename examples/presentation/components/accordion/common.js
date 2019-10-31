import React from 'react';
import posed from 'react-pose';
import styled from '@emotion/styled';

const AccordionButton = styled.button(
  {
    textAlign: 'left',
    minWidth: 400,
    cursor: 'pointer',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    border: 'none',
    backgroundColor: 'unset',
    outline: 0,
  },
  ({ isOpen }) =>
    isOpen
      ? {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }
      : null
);

const Indicator = styled.span({
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingTop: 2,
});

const PoseAccordionContents = posed.div({
  open: { maxHeight: 200 },
  closed: { maxHeight: 0 },
});

const AccordionContents = styled(({ isOpen, ...props }) => (
  <PoseAccordionContents pose={isOpen ? 'open' : 'closed'} {...props} />
))({
  overflowY: 'hidden',
  textAlign: 'justify',
});

const AccordionItem = styled.div(
  {
    display: 'grid',
    gridTemplate: 'auto auto',
    gridGap: 0,
    gridAutoFlow: 'row',
    border: '1px solid silver',
    marginBottom: -1,
  },
  ({ direction }) => ({
    gridAutoFlow: direction === 'horizontal' ? 'column' : 'row',
  })
);

const TabButtons = styled.div({ display: 'flex' });
const TabButton = styled(AccordionButton)({
  textAlign: 'center',
});
const TabItems = styled.div({
  position: 'relative',
  minHeight: 160,
});

const BelowTabItem = posed.div({
  open: { opacity: 1, top: 0 },
  closed: { opacity: 0, top: 30 },
});

const AboveTabItem = posed.div({
  open: { opacity: 1, bottom: 0 },
  closed: { opacity: 0, bottom: 30 },
});

const TabItem = styled(({ position, isOpen, ...props }) => {
  const pose = isOpen ? 'open' : 'closed';
  return position === 'above' ? (
    <AboveTabItem {...props} pose={pose} />
  ) : (
    <BelowTabItem {...props} pose={pose} />
  );
})({
  position: 'absolute',
  overflowY: 'hidden',
});

function preventClose(state, changes) {
  if (changes.type === 'closing' && state.openIndexes.length < 2) {
    return { ...changes, openIndexes: state.openIndexes };
  }
  return changes;
}

function single(state, changes) {
  if (changes.type === 'opening') {
    return { openIndexes: changes.openIndexes.slice(-1) };
  }
  return changes;
}

function combineReducers(...reducers) {
  return (state, changes) => {
    for (const reducer of reducers) {
      const result = reducer(state, changes);
      if (result !== changes) {
        return result;
      }
    }
    return changes;
  };
}

export {
  AccordionButton,
  AccordionItem,
  AccordionContents,
  AboveTabItem,
  BelowTabItem,
  Indicator,
  TabItem,
  TabItems,
  TabButton,
  TabButtons,
  combineReducers,
  preventClose,
  single,
};
