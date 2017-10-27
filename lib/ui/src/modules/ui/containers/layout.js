import pick from 'lodash.pick';
import Layout from '../components/layout';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = ({ shortcutOptions, uiOptions }) => ({
  ...pick(uiOptions, 'layout'),
  ...pick(shortcutOptions, 'goFullScreen', 'showStoriesPanel', 'showAddonPanel'),
});

export default compose(genPoddaLoader(mapper))(Layout);
