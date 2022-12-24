import type { ViewMode } from '@storybook/types';
import { styled } from '@storybook/theming';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TabButton } from '@storybook/components';

const getGridTemplate = ({
  panelPosition,
  viewMode,
}: {
  panelPosition: LayoutState['panelPosition'];
  viewMode: ViewMode;
}) => {
  if (viewMode !== 'story' && viewMode !== 'docs') {
    return `
    .sb-layout {
      grid-template-areas: 
        "a sSidebar o o o"
        "a sSidebar o o o"
        "a sSidebar o o o"; 
    }`;
  }

  if (viewMode !== 'story') {
    return `
    .sb-layout {
      grid-template-areas: 
        "a sSidebar c c c"
        "a sSidebar c c c"
        "a sSidebar c c c"; 
    }`;
  }

  if (panelPosition === 'right') {
    return `
    .sb-layout {
      grid-template-areas: 
        "a sSidebar c sHorizontal b"
        "a sSidebar c sHorizontal b"
        "a sSidebar c sHorizontal b"; 
    }`;
  }

  return `
    .sb-layout {
      grid-template-areas: 
        "a sSidebar c c c"
        "a sSidebar sVertical sVertical sVertical"
        "a sSidebar b b b"; 
    }`;
};

const Bar = styled.nav(
  {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 40,
    display: 'flex',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',

    '& > *': {
      flex: 1,
    },
  },
  ({ theme }) => ({
    background: theme.barBg,
  })
);

const MARGIN = 10;

const SHARED = `
body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  width: 100vw;
}

.sb-layout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}
`;

const DESKTOP = `

.sb-layout {
  display: grid; 
  gap: 0; 
}

.sb-hoverblock {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  height: 100vh;
  width: 100vw;
}

.sb-aside { 
  grid-area: a;
  position: relative;
  z-index: 3;
}
.sb-content { 
  grid-area: c;
  position: relative;
  z-index: 1;
}
.sb-custom { 
  grid-area: o;
  position: relative;
  z-index: 1;
}
.sb-panel { 
  grid-area: b;
  position: relative;
  z-index: 2;
}

.sb-sizer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 4;
}

.sb-sizer:hover .sb-shade {
  opacity: 1;
}

.sb-mobile-control {
  display: none;
}

.sb-sHorizontal {
  grid-area: sHorizontal;
  width: ${MARGIN * 2}px;
  margin-left: -${MARGIN}px;
  cursor: col-resize;
  top: 100px;
  bottom: 100px;
}
.sb-sHorizontal .sb-shade {
  transform: rotate(180deg);
  left: 0;
}
.sb-sVertical .sb-shade {
  // transform: rotate(90deg);
  left: 0;
  width: 100%;
  transform: rotate(180deg);
  height: ${MARGIN}px;
  background-size: 100% ${MARGIN * 2}px;
  background-position: 50% ${MARGIN}px;

}

.sb-sVertical {
  grid-area: sVertical;
  height: ${MARGIN * 2}px;
    margin-top: -${MARGIN}px;
  cursor: row-resize;
  left: 100px;
  right: 100px;
}
.sb-sSidebar {
  grid-area: sSidebar;
  width: ${MARGIN * 2}px;
  margin-left: -${MARGIN}px;
  cursor: col-resize;
  top: 100px;
  bottom: 100px;
}

.sb-shade {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  width: ${MARGIN}px;
  background: radial-gradient(at center center,rgba(0,0,0,1) 0%,transparent 70%,transparent 100%);
  background-size: ${MARGIN * 2}px 100%;
  background-position: ${MARGIN}px 50%;
  opacity: 0;
  transition: opacity 0.2s;
}
`;

const MOBILE = `
.sb-aside { 
  position: absolute;
  top: 0;
  left: 0;
  bottom: 40px;
  right: 30%;
  transform: translateX(0%);
  transition: transform 0.3s;
  z-index: 3;
}
.sb-aside[hidden] { 
  display: block;
  transform: translateX(-100%);
}

.sb-content { 
  position: absolute;
  top: 0;
  left: 0;
  bottom: 40px;
  right: 0;
  z-index: 1;
}

.sb-custom { 
  position: absolute;
  top: 0;
  left: 0;
  bottom: 40px;
  right: 0;
  z-index: 1;
}

.sb-hoverblock {
  display: none;
}

.sb-aside:not([hidden]) + .sb-panel {
  display: block;
  transform: translateX(100%);
}
.sb-panel { 
  position: absolute;
  top: 0;
  left: 30%;
  bottom: 40px;
  right: 0;
  transform: translateX(0%);
  transition: transform 0.3s;
  z-index: 2;
}
.sb-panel[hidden] { 
  display: block;
  transform: translateX(100%);
}
.sb-mobile-control { 
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 40px;
  z-index: 4;

  display: flex;
}
.sb-mobile-control > * {
  flex: 1;
} 

`;

interface LayoutState {
  panelPosition: 'bottom' | 'right';
  panel: boolean;
  sidebar: boolean;
  viewMode: ViewMode;
}

interface Props {
  state: LayoutState;
  setState: (state: Partial<Omit<LayoutState, 'viewMode'>>) => void;

  slotMain?: React.ReactNode;
  slotSidebar?: React.ReactNode;
  slotPanel?: React.ReactNode;
  slotCustom?: React.ReactNode;
}

export const Layout = ({ state, setState, ...slots }: Props) => {
  const sHorizontalRef = useRef<HTMLDivElement>(null);
  const sVerticalRef = useRef<HTMLDivElement>(null);
  const sSidebarRef = useRef<HTMLDivElement>(null);

  const sidebar = state.sidebar === undefined ? true : state.sidebar;
  const panelPosition = state.panelPosition === undefined ? 'bottom' : state.panelPosition;
  const panel = state.panel === undefined ? true : state.panel;
  const viewMode = state.viewMode === undefined ? 'story' : state.viewMode;

  const [isDragging, setDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(sidebar ? 20 : 0);
  const [panelHeight, setPanelHeight] = useState(panelPosition === 'bottom' ? 20 : 0);
  const [panelWidth, setPanelWidth] = useState(panelPosition === 'right' ? 20 : 0);

  const x = useRef({ sidebarWidth, panelHeight, panelWidth });
  x.current.panelHeight = panelHeight;
  x.current.panelWidth = panelWidth;
  x.current.sidebarWidth = sidebarWidth;

  // respond to state changes upstream
  useEffect(() => {
    if (panel && panelPosition === 'bottom' && x.current.panelHeight === 0) {
      // TODO: take from some preference
      setPanelHeight(20);
    }
    if (panel && panelPosition === 'right' && x.current.panelWidth === 0) {
      // TODO: take from some preference
      setPanelWidth(20);
    }
    if (!panel) {
      setPanelWidth(0);
      setPanelHeight(0);
    }

    if (sidebar && x.current.sidebarWidth === 0) {
      // TODO: take from some preference
      setSidebarWidth(20);
    }
    if (!sidebar && x.current.sidebarWidth !== 0) {
      setSidebarWidth(0);
    }
  }, [panel, panelPosition, sidebar]);

  useEffect(() => {
    const sHorizontal = sHorizontalRef.current;
    const sVertical = sVerticalRef.current;
    const sSidebar = sSidebarRef.current;
    let current: typeof sHorizontal | typeof sVertical | typeof sSidebar | null = null;

    const onDragStart = (e: MouseEvent) => {
      setDragging(true);
      e.preventDefault();
      if (e.currentTarget === sHorizontal) {
        current = sHorizontal;
      } else if (e.currentTarget === sVertical) {
        current = sVertical;
      } else if (e.currentTarget === sSidebar) {
        current = sSidebar;
      }
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', onDragEnd);
    };

    const onDragEnd = (e: MouseEvent) => {
      setDragging(false);
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onDragEnd);
    };

    const onDrag = (e: MouseEvent) => {
      if (e.buttons === 0) {
        onDragEnd(e);
        return;
      }

      if (current === sSidebar) {
        const value = Math.round((e.clientX / e.view.innerWidth) * 100);
        if (value + x.current.panelWidth > 70) {
          // preserve space for content
          return;
        }

        if (value < 5) {
          if (x.current.sidebarWidth !== 0) {
            setState({ sidebar: false });
            setSidebarWidth(0);
          }
          return;
        }

        if (x.current.sidebarWidth === 0) {
          setState({ sidebar: true });
        }

        setSidebarWidth(value);
      } else if (current === sHorizontal) {
        const value = 100 - Math.round((e.clientX / e.view.innerWidth) * 100);
        if (value + x.current.sidebarWidth > 70) {
          // preserve space for content
          return;
        }

        if (value < 5) {
          if (x.current.panelWidth !== 0) {
            setState({ panel: false });
            setPanelWidth(0);
          }
          return;
        }
        if (x.current.panelWidth === 0) {
          setState({ panel: true });
        }

        setPanelWidth(value);
      } else if (current === sVertical) {
        const value = 100 - Math.round((e.clientY / e.view.innerHeight) * 100);
        if (value > 70) {
          return;
        }
        if (value < 5) {
          if (x.current.panelHeight !== 0) {
            setState({ panel: false });
            setPanelHeight(0);
          }
          return;
        }

        if (x.current.panelHeight === 0) {
          setState({ panel: true });
        }

        setPanelHeight(value);
      }
    };

    sHorizontal?.addEventListener('mousedown', onDragStart);
    sVertical?.addEventListener('mousedown', onDragStart);
    sSidebar?.addEventListener('mousedown', onDragStart);

    return () => {
      sHorizontal?.removeEventListener('mousedown', onDragStart);
      sVertical?.removeEventListener('mousedown', onDragStart);
      sSidebar?.removeEventListener('mousedown', onDragStart);
    };
  });

  const k = panelPosition === 'bottom' ? panelHeight : panelWidth;
  const mobileNavShown = sidebarWidth !== 0;
  const mobilePanelShown = k !== 0 && mobileNavShown === false;

  const mobileActions = useMemo(() => {
    const setNavShown = () => {
      // TODO: 30 is an assumption
      setSidebarWidth(30);
      setState({ sidebar: true, panel: false });
      setPanelWidth(0);
      setPanelHeight(0);
    };

    const setPanelShown = () => {
      // TODO: 30 is an assumption
      setPanelWidth(30);
      setPanelHeight(30);
      setState({ sidebar: false, panel: true });
      setSidebarWidth(0);
    };
    const setContentShown = () => {
      // TODO: bottom panel is an assumption
      setState({ sidebar: false, panel: false });
      setPanelWidth(0);
      setPanelHeight(0);
      setSidebarWidth(0);
    };

    return {
      setNavShown,
      setPanelShown,
      setContentShown,
    };
  }, [setState]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SHARED }} />
      <style media="(min-width: 600px)" dangerouslySetInnerHTML={{ __html: DESKTOP }} />
      <style media="(max-width: 599px)" dangerouslySetInnerHTML={{ __html: MOBILE }} />
      <style
        media="(min-width: 600px)"
        dangerouslySetInnerHTML={{ __html: getGridTemplate({ panelPosition, viewMode }) }}
      />
      <div
        className="sb-layout"
        style={{
          gridTemplateColumns: `${sidebarWidth}% 0px 1fr 0 ${panelWidth}%`,
          gridTemplateRows: `1fr 0px ${panelHeight}%`,
        }}
      >
        <div className="sb-content" hidden={viewMode !== 'story' && viewMode !== 'docs'}>
          {slots.slotMain}
        </div>

        <div className="sb-custom" hidden={!(viewMode !== 'story' && viewMode !== 'docs')}>
          {slots.slotCustom}
        </div>

        <div className="sb-aside" hidden={sidebarWidth === 0}>
          {slots.slotSidebar}
        </div>
        <div
          className="sb-panel"
          hidden={
            viewMode !== 'story' ||
            (panelPosition === 'bottom' && panelHeight === 0) ||
            (panelPosition === 'right' && panelWidth === 0) ||
            (panelPosition !== 'right' && panelPosition !== 'bottom')
          }
        >
          {slots.slotPanel}
        </div>

        <div
          className="sb-sizer sb-sHorizontal"
          ref={sHorizontalRef}
          hidden={!(panelPosition === 'right' && viewMode === 'story')}
        >
          <div className="sb-shade" />
        </div>
        <div
          className="sb-sizer sb-sVertical"
          ref={sVerticalRef}
          hidden={!(panelPosition === 'bottom' && viewMode === 'story')}
        >
          <div className="sb-shade" />
        </div>
        <div className="sb-sizer sb-sSidebar" ref={sSidebarRef}>
          <div className="sb-shade" />
        </div>

        <Bar className="sb-mobile-control">
          <TabButton onClick={mobileActions.setNavShown} active={mobileNavShown}>
            Sidebar
          </TabButton>
          <TabButton
            onClick={mobileActions.setContentShown}
            active={!mobileNavShown && !mobilePanelShown}
          >
            {viewMode === 'story' ? 'Canvas' : null}
            {viewMode === 'docs' ? 'Docs' : null}
            {viewMode !== 'docs' && viewMode !== 'story' ? 'Page' : null}
          </TabButton>
          <TabButton
            onClick={mobileActions.setPanelShown}
            active={mobilePanelShown}
            hidden={viewMode !== 'story'}
          >
            Addons
          </TabButton>
        </Bar>

        {isDragging ? <div className="sb-hoverblock" /> : null}
      </div>
    </>
  );
};
