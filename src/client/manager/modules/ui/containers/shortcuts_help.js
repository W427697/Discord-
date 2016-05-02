import ShortcutsHelp from '../components/shortcuts_help';
import { useDeps, compose, composeAll } from 'mantra-core';

export const composer = ({ context, actions }, onData) => {
  const { reduxStore } = context();
  const actionMap = actions();

  const processState = () => {
    const { ui } = reduxStore.getState();
    const data = {
      isOpen: ui.showShortcutsHelp,
      onClose: actionMap.ui.toggleShortcutsHelp,
    };

    onData(null, data);
  };

  processState();
  reduxStore.subscribe(processState);
};

export default composeAll(
  compose(composer),
  useDeps()
)(ShortcutsHelp);
