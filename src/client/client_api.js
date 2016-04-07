import React, { Component, PropTypes } from 'react'

export default class ClientApi {
  constructor({ syncedStore, storyStore }) {
    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  storiesOf(kind, m) {
    if (m && m.hot) {
      m.hot.dispose(() => {
        this._storyStore.removeStoryKind(kind);
      });
    }

    const add = (storyName, fn) => {
      this._storyStore.addStory(kind, storyName, fn);
      return { add };
    };

    return { add };
  }

  action(name) {
    const syncedStore = this._syncedStore;

    return function (..._args) {
      const args = Array.from(_args);
      let { actions = [] } = syncedStore.getData();

      // Remove events from the args. Otherwise, it creates a huge JSON string.
      if (
        args[0] &&
        args[0].constructor &&
        /Synthetic/.test(args[0].constructor.name)
      ) {
        args[0] = `[${args[0].constructor.name}]`;
      }

      actions = [{ name, args }].concat(actions.slice(0, 4));
      syncedStore.setData({ actions });
    };
  }
  
}


export class WithState extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { handlers } = this.props;
    let child = this.props.children;

    let props = Object.assign({}, this.state);

    for (let act in handlers) {
      let prop = handlers[ act ];
      props[ act ] = (v) => {
        if (typeof(child.props[ act ]) === 'function')  {
          child.props[ act ](v);
        }
        this.setState({ [ prop ] : v });
      }
    }
    return React.cloneElement(child, props);
  }

}


WithState.propTypes = {
  children: PropTypes.object.isRequired
};



export const withState = (handlers, renderChildren) => () => (
  <WithState handlers={ handlers }>{ renderChildren() }</WithState>
);

