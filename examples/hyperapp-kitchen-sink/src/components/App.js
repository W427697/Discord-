import { h } from 'hyperapp';
import Button from './Button';

const App = (state, actions) => (
  <main>
    <h1>Welcome to Hyperapp Demo App!</h1>
    <div>
      <h1>{state.count}</h1>
      <Button onclick={() => actions.down(1)}>-</Button>
      <Button onclick={() => actions.up(1)}>+</Button>
    </div>
  </main>
);

export default App;
