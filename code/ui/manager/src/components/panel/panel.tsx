import React, { Component } from 'react';
import { Tabs } from '@storybook/components';
import { IconButton } from '@storybook/components/experimental';
import type { State } from '@storybook/manager-api';
import { shortcutToHumanString } from '@storybook/manager-api';
import type { Addon_BaseType } from '@storybook/types';
import { styled } from '@storybook/theming';
import { useLayout } from '../layout/_context';

export interface SafeTabProps {
  title: Addon_BaseType['title'];
  id: string;
  children: Addon_BaseType['render'];
}

class SafeTab extends Component<SafeTabProps, { hasError: boolean }> {
  constructor(props: SafeTabProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ hasError: true });
    // eslint-disable-next-line no-console
    console.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return children;
  }
}

const ButtonGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  gap: 10,
});

const AddonPanel = React.memo<{
  selectedPanel?: string;
  actions: { onSelect: (id: string) => void } & Record<string, any>;
  panels: Record<string, Addon_BaseType>;
  shortcuts: State['shortcuts'];
  panelPosition?: 'bottom' | 'right';
  absolute?: boolean;
}>(
  ({
    panels,
    shortcuts,
    actions,
    selectedPanel = null,
    panelPosition = 'right',
    absolute = true,
  }) => {
    const { isDesktop, setMobileAddonsOpen } = useLayout();

    return (
      <Tabs
        absolute={absolute}
        {...(selectedPanel ? { selected: selectedPanel } : {})}
        menuName="Addons"
        actions={actions}
        tools={
          isDesktop ? (
            <ButtonGroup>
              {panelPosition === 'bottom' ? (
                <IconButton
                  key="position"
                  size="small"
                  variant="ghost"
                  icon="SidebarAlt"
                  title={`Change addon orientation [${shortcutToHumanString(
                    shortcuts.panelPosition
                  )}]`}
                  onClick={actions.togglePosition}
                />
              ) : (
                <IconButton
                  key="position"
                  size="small"
                  variant="ghost"
                  icon="BottomBar"
                  title={`Change addon orientation [${shortcutToHumanString(
                    shortcuts.panelPosition
                  )}]`}
                  onClick={actions.togglePosition}
                />
              )}
              <IconButton
                key="visibility"
                size="small"
                variant="ghost"
                icon="Close"
                title={`Hide addons [${shortcutToHumanString(shortcuts.togglePanel)}]`}
                onClick={actions.toggleVisibility}
              />
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <IconButton
                size="small"
                variant="ghost"
                icon="Close"
                onClick={() => setMobileAddonsOpen(false)}
              />
            </ButtonGroup>
          )
        }
        id="storybook-panel-root"
      >
        {Object.entries(panels).map(([k, v]) => (
          <SafeTab key={k} id={k} title={typeof v.title === 'function' ? <v.title /> : v.title}>
            {v.render}
          </SafeTab>
        ))}
      </Tabs>
    );
  }
);

AddonPanel.displayName = 'AddonPanel';

export default AddonPanel;
