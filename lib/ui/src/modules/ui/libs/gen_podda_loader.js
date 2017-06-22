export default function genPoddaLoader(fn) {
  return (props, onData, env) => {
    const { clientStore } = env.context();
    const { theming } = env.actions();
    const processState = () => {
      try {
        const state = clientStore.getAll();
        const data = fn(state, props, env);
        data.theme = theming.getTheme();
        onData(null, data);
      } catch (ex) {
        onData(ex);
      }
    };

    processState();
    return clientStore.subscribe(processState);
  };
}
