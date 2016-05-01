import routes from './routes';
import actions from './actions';
import reducers from './configs/reducers';
import handleRouting from './configs/handle_routing';

export default {
  routes,
  actions,
  reducers,
  load(c, a) {
    handleRouting(c, a);
  },
};
