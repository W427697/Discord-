// import pick from 'lodash.pick';
import { Layout } from '@storybook/components';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export function mapper(state, props, { actions }) {
  return {
    ...state,
    actions: actions(),
  };
}

export default compose(
  genPoddaLoader(mapper),
  { withRef: false }
)(Layout);
