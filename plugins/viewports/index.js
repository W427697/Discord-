import { registerPlugin } from '@storybook/ui';

const sizes = {
  iphone: {
    name: 'size1',
    size: {
      width: 320,
      height: 480,
    },
  },
  s8: {
    name: 'size2',
    size: {
      width: 420,
      height: 680,
    },
  },
};

const previewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const selectStyle = {
  marginTop: 10,
  marginBottom: 20,
};

const containerStyle = {
  height: '100%',
  width: '100%',
};

function decoratePreview(Preview, { React }) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        phone: 'iphone',
      };

      this.changeSize = this.changeSize.bind(this);
      this.toggleViewport = this.toggleViewport.bind(this);
    }

    changeSize(event) {
      event.persist();
      this.setState(() => ({ phone: event.target.value }));
    }

    toggleViewport() {
      this.props.dispatch({
        type: 'TOGGLE_VIEWPORTS',
      });
    }

    render() {
      const { viewportEnabled } = this.props;
      const { width, height } = sizes[this.state.phone].size;

      return (
        <div style={containerStyle}>
          <button style={{ margin: 10 }} onClick={this.toggleViewport}>
            {viewportEnabled ? 'Disable' : 'Enable'}
          </button>
          {viewportEnabled &&
            <div style={previewStyle}>
              <div style={selectStyle}>
                <select value={this.state.phone} onChange={this.changeSize}>
                  {Object.keys(sizes).map(key => {
                    const { name } = sizes[key];
                    return <option key={name} value={key}>{name}</option>;
                  })}
                </select>
              </div>
              <div style={{ width, height, margin: 'auto' }}>
                <Preview {...this.props} />
              </div>
            </div>}
          {!viewportEnabled && <Preview {...this.props} />}
        </div>
      );
    }
  };
}

const mapPreviewState = (state, map) => {
  return Object.assign(map, {
    viewportEnabled: state.plugins.viewport.viewportEnabled,
  });
};

const reduce = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_VIEWPORTS': {
      return {
        ...state,
        plugins: {
          ...state.plugins,
          viewport: {
            viewportEnabled: !state.plugins.viewport.viewportEnabled,
          },
        },
      };
    }
    default:
      return state;
  }
};

registerPlugin({
  decoratePreview,
  mapPreviewState,
  reduce,
});
