import { themesMap, updateThemesList } from '../actions/theming';


export default function(clientStore, actions) {
  updateThemesList(clientStore);

  /* uncomment this line to get access to API via browser console */
  console.log('UI API:', actions);
  
  /**
   * right click on 'UI API:' and 'Store as GlobalVariable'
   * api = temp1;
   * api.getThemesList()
   * api.theming.getTheme()
   * api.theming.selectTheme('dark')
   * newTheme = api.theming.getTheme()
   * newTheme.name = 'new'
   * api.setTheme(newTheme);
   * 
   */
}

