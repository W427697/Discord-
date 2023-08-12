import { useContext } from 'react';
import { ManagerContext, addons } from '@storybook/manager-api';

const isFunction = (val: unknown): val is CallableFunction => typeof val === 'function';

const useShowToolbar = (showToolbar: boolean) => {
  const { state } = useContext(ManagerContext);

  const config = addons.getConfig();
  if (!isFunction(config?.toolbar?.showToolbar)) {
    return showToolbar;
  }

  const params = {
    path: state.path,
    viewMode: state.viewMode,
    singleStory: state.singleStory,
    layout: state.layout,
    storyId: state.storyId,
  };

  return config.toolbar.showToolbar(params);
};

export default useShowToolbar;
