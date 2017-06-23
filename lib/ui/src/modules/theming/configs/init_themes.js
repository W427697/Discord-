import { themesMap, updateThemesList } from '../actions/theming';


export default function(clientStore, actions) {
  updateThemesList(clientStore);
}

