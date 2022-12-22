import type { ViewMode } from '@storybook/types';
import { styled } from '@storybook/theming';
import React, { useEffect, useRef, useState } from 'react';
import { TabButton } from '@storybook/components';

const getGridTemplate = ({
  panel,
  viewMode,
}: {
  panel: 'bottom' | 'right' | false;
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

  if (panel === 'right') {
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

interface Props {
  panel?: 'bottom' | 'right' | false;
  sidebar?: boolean;
  slotMain?: React.ReactNode;
  slotSidebar?: React.ReactNode;
  slotPanel?: React.ReactNode;
  slotCustom?: React.ReactNode;
  viewMode?: ViewMode;
}

export const Layout = ({
  panel,
  sidebar,
  slotMain,
  slotSidebar,
  slotPanel,
  slotCustom,
  viewMode = 'story',
}: Props) => {
  const sHorizontalRef = useRef<HTMLDivElement>(null);
  const sVerticalRef = useRef<HTMLDivElement>(null);
  const sSidebarRef = useRef<HTMLDivElement>(null);

  const [isDragging, setDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(sidebar ? 20 : 0);
  const [panelHeight, setPanelHeight] = useState(panel === 'bottom' ? 20 : 0);
  const [panelWidth, setPanelWidth] = useState(panel === 'right' ? 20 : 0);

  const x = useRef({ sidebarWidth, bottomHeight: panelHeight, columnWidth: panelWidth });
  x.current.bottomHeight = panelHeight;
  x.current.columnWidth = panelWidth;
  x.current.sidebarWidth = sidebarWidth;

  useEffect(() => {
    if (panel === 'bottom' && x.current.bottomHeight === 0) {
      setPanelHeight(20);
    }
    if (panel === 'right' && x.current.columnWidth === 0) {
      setPanelWidth(20);
    }
    if (!panel) {
      setPanelWidth(0);
      setPanelHeight(0);
    }

    if (sidebar && x.current.sidebarWidth === 0) {
      setSidebarWidth(20);
    }
    if (!sidebar && x.current.sidebarWidth !== 0) {
      setSidebarWidth(0);
    }
  }, [panel, sidebar]);

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
        if (value + panelWidth > 70) {
          // preserve space for content
          return;
        }

        if (value < 5) {
          setSidebarWidth(0);
          return;
        }
        setSidebarWidth(value);
      } else if (current === sHorizontal) {
        const value = 100 - Math.round((e.clientX / e.view.innerWidth) * 100);
        if (value + sidebarWidth > 70) {
          // preserve space for content
          return;
        }

        if (value < 5) {
          setPanelWidth(0);
          return;
        }

        setPanelWidth(value);
      } else if (current === sVertical) {
        const value = 100 - Math.round((e.clientY / e.view.innerHeight) * 100);
        if (value > 70) {
          return;
        }
        if (value < 5) {
          setPanelHeight(0);
          return;
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

  const k = panel === 'bottom' ? panelHeight : panelWidth;
  const mobileNavShown = sidebarWidth !== 0;
  const mobilePanelShown = k !== 0 && mobileNavShown === false;

  const setMobileNavShown = () => {
    setSidebarWidth(30);
    setPanelWidth(0);
    setPanelHeight(0);
  };

  const setMobilePanelShown = () => {
    setPanelWidth(30);
    setPanelHeight(30);
    setSidebarWidth(0);
  };
  const setMobileContentShown = () => {
    setPanelWidth(0);
    setPanelHeight(0);
    setSidebarWidth(0);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SHARED }} />
      <style media="(min-width: 600px)" dangerouslySetInnerHTML={{ __html: DESKTOP }} />
      <style media="(max-width: 599px)" dangerouslySetInnerHTML={{ __html: MOBILE }} />
      <style
        media="(min-width: 600px)"
        dangerouslySetInnerHTML={{ __html: getGridTemplate({ panel, viewMode }) }}
      />
      <div
        className="sb-layout"
        style={{
          gridTemplateColumns: `${sidebarWidth}% 0px 1fr 0 ${panelWidth}%`,
          gridTemplateRows: `1fr 0px ${panelHeight}%`,
        }}
      >
        <div className="sb-content" hidden={viewMode !== 'story' && viewMode !== 'docs'}>
          {slotMain}
        </div>

        <div className="sb-custom" hidden={!(viewMode !== 'story' && viewMode !== 'docs')}>
          {slotCustom}
        </div>

        <div className="sb-aside" hidden={sidebarWidth === 0}>
          {slotSidebar}
        </div>
        <div
          className="sb-panel"
          hidden={
            viewMode !== 'story' ||
            (panel === 'bottom' && panelHeight === 0) ||
            (panel === 'right' && panelWidth === 0) ||
            (panel !== 'right' && panel !== 'bottom')
          }
        >
          {slotPanel}
        </div>

        <div
          className="sb-sizer sb-sHorizontal"
          ref={sHorizontalRef}
          hidden={panel !== 'right' || viewMode !== 'story'}
        >
          <div className="sb-shade" />
        </div>
        <div
          className="sb-sizer sb-sVertical"
          ref={sVerticalRef}
          hidden={panel !== 'bottom' || viewMode !== 'story'}
        >
          <div className="sb-shade" />
        </div>
        <div className="sb-sizer sb-sSidebar" ref={sSidebarRef}>
          <div className="sb-shade" />
        </div>

        <Bar className="sb-mobile-control">
          <TabButton onClick={() => setMobileNavShown()} active={mobileNavShown}>
            Sidebar
          </TabButton>
          <TabButton
            onClick={() => setMobileContentShown()}
            active={!mobileNavShown && !mobilePanelShown}
          >
            {viewMode ? 'Canvas' : 'Page'}
          </TabButton>
          <TabButton
            onClick={() => setMobilePanelShown()}
            active={mobilePanelShown}
            hidden={viewMode !== 'story' || (panel !== 'right' && panel !== 'bottom')}
          >
            Addons
          </TabButton>
        </Bar>

        {isDragging ? <div className="sb-hoverblock" /> : null}
      </div>
    </>
  );
};
