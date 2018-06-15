/* global document */
import { h, app } from 'hyperapp';
import App from './components/App';

const state = {
  count: 0,
};

const actions = {
  down: value => prevState => ({ count: prevState.count - value }),
  up: value => prevState => ({ count: prevState.count + value }),
};

app(state, actions, App, document.querySelector('#root'));
