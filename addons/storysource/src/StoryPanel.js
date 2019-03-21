import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { toId } from '@storybook/router';
import { Editor } from '@storybook/components';
import { document } from 'global';
import { FileExplorer, BrowserPreview, SandpackProvider } from 'react-smooshpack';
import Draggable from 'react-draggable';
import { Subscriber } from 'react-broadcast';
import { SAVE_FILE_EVENT_ID, STORY_EVENT_ID } from './events';

const getLocationKeys = locationsMap =>
  locationsMap
    ? Array.from(Object.keys(locationsMap)).sort(
        (key1, key2) => locationsMap[key1].startLoc.line - locationsMap[key2].startLoc.line
      )
    : [];

const BOOTSTRAPPER_JS = '/storysource/bootstrapper.js';

export default class StoryPanel extends Component {
  state = {
    source: '// 🦄 Looking for it, hold on tight',
    lineDecorations: [],
    additionalStyles: css`
      background-color: #c6ff0040;
    `,
  };

  componentDidMount() {
    const { channel } = this.props;

    channel.on(STORY_EVENT_ID, this.listener);
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener(STORY_EVENT_ID, this.listener);
  }

  listener = ({
    edition: { source, mainFileLocation, dependencies, localDependencies, prefix, idsToFrameworks },
    story: { story, kind },
    location: { currentLocation, locationsMap },
  }) => {
    const locationsKeys = getLocationKeys(locationsMap);

    this.setState({
      story,
      kind,
      source,
      dependencies,
      localDependencies,
      currentLocation,
      mainFileLocation,
      prefix,
      idsToFrameworks,
      locationsMap, // eslint-disable-line react/no-unused-state
      locationsKeys, // eslint-disable-line react/no-unused-state
    });

    // eslint-disable-next-line no-console
    console.log({
      story,
      kind,
      source,
      currentLocation,
      locationsMap,
      dependencies,
      localDependencies,
      mainFileLocation,
      prefix,
      idsToFrameworks,
    });
  };

  editorDidMount = (editor, monaco) => {
    editor.addAction({
      id: 'save-the-selected-story-in-source-file',
      label: '🇸 Save the selected story in source file',
      keybindings: [
        // eslint-disable-next-line no-bitwise
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        // chord
        monaco.KeyMod.chord(
          // eslint-disable-next-line no-bitwise
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_X,
          // eslint-disable-next-line no-bitwise
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
        ),
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: thisEditor => {
        const { channel } = this.props;
        const { prefix } = this.state;
        const content = thisEditor.getModel().getValue();
        channel.emit(SAVE_FILE_EVENT_ID, {
          fileName: `${prefix}${this.openedPath}`,
          content,
        });
        return null;
      },
    });
  };

  onStoryRendered = editor => {
    // For better safety, I try not to consider that everything is defined
    const { currentLocation } = this.state;
    const { startLoc } = currentLocation || { startLoc: { line: 0 } };
    const { line: startLocLine } = startLoc;

    if (this.currentlyRenderingMainFile()) {
      // eslint-disable-next-line no-underscore-dangle
      editor._revealLine(startLocLine);
      // eslint-disable-next-line no-underscore-dangle
      editor._actions['editor.action.jumpToBracket']._run();
    }
  };

  currentlyRenderingMainFile = () => {
    const { mainFileLocation } = this.state;
    return !this.openedPath || this.openedPath === mainFileLocation;
  };

  updateSource = (
    newSource,
    {
      changes: [
        {
          range: { startLineNumber, endLineNumber, endColumn, startColumn },
          text,
        },
      ],
    }
  ) => {
    const {
      currentLocation: {
        startLoc: { line: startLocLine, col: startLocCol },
        endLoc: { line: endLocLine, col: endLocCol },
      },
      localDependencies,
    } = this.state;

    const newEndLocLine =
      endLocLine -
      (endLineNumber - startLineNumber) /* selection range cut */ +
      text.split('').filter(x => x === '\n')
        .length; /* all the line feeds in the replacement text */
    let newEndLocCol;
    if (endLineNumber < endLocLine) {
      /* edge column not moving if change occuring above */
      newEndLocCol = endLocCol;
    } else if (startLineNumber === endLineNumber && text.indexOf('\n') === -1) {
      /* new character typed / removed */
      newEndLocCol = endLocCol + text.length - (endColumn - startColumn);
    } else {
      /* the last line was probably merged with the previous one(s) */
      newEndLocCol = newSource.split('\n')[newEndLocLine - 1].length - 1;
    }

    const { source } = this.state;
    let updatedMain = source;
    let updatedLocalDependencies = localDependencies;
    if (this.currentlyRenderingMainFile()) {
      updatedMain = newSource;
    } else {
      updatedLocalDependencies = { ...localDependencies, [this.openedPath]: { code: newSource } };
    }

    this.setState({
      source: updatedMain,
      localDependencies: updatedLocalDependencies,
      currentLocation: {
        startLoc: { line: startLocLine, col: startLocCol },
        endLoc: { line: newEndLocLine, col: newEndLocCol },
      },
    });
  };

  handleFileExplorerResize = (e, { x }) => {
    this.setState({ fileExplorerWidth: x });
  };

  changePosition = (e, editor, monaco) => {
    const {
      additionalStyles,
      lineDecorations,
      currentLocation: { startLoc, endLoc },
    } = this.state;
    const highlightClassName = `css-${additionalStyles.name}`;
    // probably a bug in monaco editor.
    // we will prevent the first highlighting from gluing in the editor
    const allDecorations = (lineDecorations || [])
      // eslint-disable-next-line no-underscore-dangle
      .concat(Object.keys(editor._modelData.viewModel.decorations._decorationsCache));
    let newDecorations = [];
    if (this.currentlyRenderingMainFile()) {
      newDecorations = [
        {
          range: new monaco.Range(startLoc.line, startLoc.col + 1, endLoc.line, endLoc.col + 1),
          options: { isWholeLine: false, inlineClassName: highlightClassName },
        },
      ];
    }
    const editorDecorations = editor.deltaDecorations(allDecorations, newDecorations);

    if (
      (this.currentlyRenderingMainFile() && e.position.lineNumber < startLoc.line) ||
      (e.position.lineNumber === startLoc.line && e.position.column < startLoc.col)
    )
      editor.setPosition({
        lineNumber: startLoc.line,
        column: startLoc.col,
      });
    if (
      (this.currentlyRenderingMainFile() && e.position.lineNumber > endLoc.line) ||
      (e.position.lineNumber === endLoc.line && e.position.column > endLoc.col + 1)
    )
      editor.setPosition({
        lineNumber: endLoc.line,
        column: endLoc.col + 1,
      });

    if (editorDecorations[0] !== lineDecorations[0])
      this.setState({ lineDecorations: editorDecorations });
  };

  renderBootstrapCode = ({ mainFileLocation, idsToFrameworks, story, kind }) =>
    `${mainFileLocation ? `import "..${mainFileLocation}"` : ''};
import addons from "@storybook/addons";
import Events from "@storybook/core-events";
import { toId } from "@storybook/router/utils";
import { forceReRender, addDecorator } from "${(idsToFrameworks || {})[
      toId(kind || 'a', story || 'a')
    ] || '@storybook/react'}";
import { document } from "global";
import React from "react";
import {
  Global,
  ThemeProvider,
  themes,
  createReset,
  convert
} from "@storybook/theming";

addDecorator(storyFn => (
  <ThemeProvider theme={convert(themes.light)}>
    <Global styles={createReset} />
    {storyFn()}
  </ThemeProvider>
));

addons.getChannel().emit(Events.SET_CURRENT_STORY, {
  storyId: toId("${kind}", "${story}")
});
const div1 = document.createElement("div");
div1.id = "error-stack";
const div2 = document.createElement("div");
div2.id = "error-message";
document.body.appendChild(div1);
document.body.appendChild(div2);
forceReRender();
`;

  findSource = path => {
    const {
      localDependencies,
      mainFileLocation,
      source,
      idsToFrameworks,
      story,
      kind,
    } = this.state;
    if (path === mainFileLocation) return source;
    if (path === BOOTSTRAPPER_JS)
      return this.renderBootstrapCode({ mainFileLocation, idsToFrameworks, story, kind });
    if (path === '/package.json') return this.renderFakePackageJsonFile();
    return localDependencies[path].code;
  };

  renderFakePackageJsonFile = () => {
    const { entry, name, dependenciesMapping } = this.getFakeManifest();
    return JSON.stringify({ name, main: entry, dependencies: dependenciesMapping }, null, 4);
  };

  getFakeManifest = () => {
    const {
      source,
      mainFileLocation,
      dependencies,
      idsToFrameworks,
      localDependencies,
      story,
      kind,
    } = this.state;
    const storybookVersion = 'latest';
    const setOfDependencies = Array.from(
      new Set(
        (dependencies || []).concat(
          '@storybook/addons',
          '@storybook/core-events',
          '@storybook/router',
          '@storybook/react',
          'react'
        )
      )
    );
    return {
      name: `${story}-${kind}`,
      entry: BOOTSTRAPPER_JS,
      files: {
        ...localDependencies,
        [mainFileLocation]: { code: source },
        [BOOTSTRAPPER_JS]: {
          code: this.renderBootstrapCode({ mainFileLocation, idsToFrameworks, story, kind }),
        },
      },
      dependenciesMapping: Object.assign(
        {},
        ...setOfDependencies.map(d => ({
          [d]: /^@storybook\//.test(d) ? storybookVersion : 'latest',
        }))
      ),
    };
  };

  render = () => {
    const { channel, active } = this.props;
    const { additionalStyles, fileExplorerWidth } = this.state;
    const { entry, files, dependenciesMapping } = this.getFakeManifest();
    return active ? (
      <SandpackProvider
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          overflowY: 'hidden',
        }}
        files={files}
        dependencies={dependenciesMapping}
        entry={entry}
      >
        <div
          style={{
            fontFamily: 'Helvetica, sans-serif',
            boxSizing: 'border-box',
            backgroundColor: '#24282a',
            color: 'white',
            paddingTop: '0.5em',
            minWidth: `${fileExplorerWidth || 127}px`,
          }}
        >
          <FileExplorer
            css={css`
              div[style*='margin-left: '] > div:not(.sandpack-File__container):before,
              div[style*='margin-left: '] > div:not(.sandpack-File__container):before {
                content: '📁';
                position: absolute;
                margin-left: 3px;
                margin-top: 2px;
                background-color: rgb(36, 40, 42);
                z-index: 1;
              }

              .sandpack-File__container + div:not(.sandpack-File__container):before {
                content: '📂';
                margin-top: -18px;
                position: absolute;
                margin-left: -6px;
                background-color: rgb(36, 40, 42);
                z-index: 2;
              }

              .sandpack-File__container:before {
                content: '📜';
                position: absolute;
                margin-left: -14px;
              }

              .sandpack-File__container {
                transition: 0.3s ease all;
                font-family: sans-serif;
                font-size: 0.875em;
                padding: 0.3em 0.5em;
                padding-left: 0.5em;
                padding-left: 1rem;
                color: gainsboro;
                border-left: 2px solid transparent;
                cursor: pointer;
              }
              .sandpack-File__active {
                background-color: rgba(0, 0, 0, 0.3);
                border-left: 2px solid #6caedd;
              }
            `}
          />
        </div>
        <Draggable
          axis="x"
          style={{ flex: 1 }}
          bounds={{ left: 127 }}
          defaultPosition={{ x: fileExplorerWidth || 127, y: 0 }}
          onDrag={this.handleFileExplorerResize}
          onDragEnd={this.handleFileExplorerResize}
        >
          <div
            style={{
              zIndex: 10,
              width: '5',
              height: '100%',
              position: 'absolute',
              cursor: 'col-resize',
            }}
          >
            &nbsp;
          </div>
        </Draggable>
        <div
          css={css`
            flex: 1;
            width: 100%;
            height: 100%;
          `}
        >
          <Subscriber channel="sandpack">
            {({ openedPath }) => {
              this.openedPath = openedPath;
              return (
                <Editor
                  css={additionalStyles}
                  source={this.findSource(openedPath)}
                  onChange={this.updateSource}
                  componentDidMount={this.editorDidMount}
                  changePosition={this.changePosition}
                  onStoryRendered={this.onStoryRendered}
                  channel={channel}
                  resizeContainerReference={() =>
                    (document.getElementById('storybook-panel-root') || {}).parentNode
                  }
                />
              );
            }}
          </Subscriber>
        </div>
        <BrowserPreview
          css={css`
            align-items: center;
            background-color: whitesmoke;
            padding: 0.5rem;
            border-radius: 2px;
            border-bottom: 1px solid #ddd;

            iframe {
              height: 100% !important;
            }
          `}
        />
      </SandpackProvider>
    ) : null;
  };
}

StoryPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  api: PropTypes.shape({
    selectStory: PropTypes.func.isRequired,
  }).isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
};
