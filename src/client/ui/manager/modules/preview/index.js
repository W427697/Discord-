import actions from './actions';
import reducers from './configs/reducers';
import createPageBus from 'page-bus';
import initPagebus from './configs/init_pagebus';


export default {
  reducers,
  actions,
  load({ reduxStore }) {
    const bus = createPageBus();
    initPagebus(bus, reduxStore);
  },
};
