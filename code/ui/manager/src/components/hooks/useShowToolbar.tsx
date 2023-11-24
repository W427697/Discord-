import { useContext } from 'react';
import { ManagerContext, addons } from '@storybook/manager-api';

const isFunction = (val: unknown): val is CallableFunction => typeof val === 'function';

const useShowToolbar = (showToolbar: boolean) => {
  const { state } = useContext(ManagerContext);

  const config = addons.getConfig();
  if (!isFunction(config?.toolbar?.showToolbar)) {
    return showToolbar;
  }

  return config.toolbar.showToolbar(state);
};

export default useShowToolbar;
