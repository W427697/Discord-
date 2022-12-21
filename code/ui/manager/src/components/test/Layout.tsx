import type { ViewMode } from '@storybook/types';
import React, { useEffect, useRef, useState } from 'react';

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

const MARGIN = 10;

const DESKTOP = `
body{
  margin: 0;

  padding: 0;
}

.sb-layout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: grid; 
  gap: 0; 
}

.sb-aside { 
  grid-area: a;
  background: blue;
  position: relative;
  z-index: 3;
}
.sb-content { 
  grid-area: c;
  background: green;
  position: relative;
  z-index: 1;
}
.sb-custom { 
  grid-area: o;
  background: red;
  position: relative;
  z-index: 1;
}
.sb-panel { 
  grid-area: b;
  background: yellow;
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
body{
  margin: 0;
  padding: 0;
}

.sb-layout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.sb-aside { 
  position: absolute;
  top: 0;
  left: 0;
  bottom: 50px;
  right: 30%;
  background: blue;
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
  bottom: 50px;
  right: 0;
  background: green;
  z-index: 1;
}

.sb-custom { 
  position: absolute;
  top: 0;
  left: 0;
  bottom: 50px;
  right: 0;
  background: orange;
  z-index: 1;
}


.sb-aside:not([hidden]) + .sb-panel {
  display: block;
  transform: translateX(100%);
}
.sb-panel { 
  position: absolute;
  top: 0;
  left: 30%;
  bottom: 50px;
  right: 0;
  background: yellow;
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
  height: 50px;
  background: red;
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
  mainContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  panelContent?: React.ReactNode;
  customContent?: React.ReactNode;
  viewMode?: ViewMode;
}

export const Layout = ({
  panel,
  sidebar,
  mainContent,
  sidebarContent,
  panelContent,
  customContent,
  viewMode = 'story',
}: Props) => {
  const resizer0 = useRef<HTMLDivElement>(null);
  const resizer1 = useRef<HTMLDivElement>(null);
  const resizer2 = useRef<HTMLDivElement>(null);

  const [sidebarWidth, setSidebarWidth] = useState(sidebar ? 20 : 0);
  const [bottomHeight, setBottomHeight] = useState(panel === 'bottom' ? 20 : 0);
  const [columnWidth, setColumnWidth] = useState(panel === 'right' ? 20 : 0);

  useEffect(() => {
    const sHorizontal = resizer0.current;
    const sVertical = resizer1.current;
    const sSidebar = resizer2.current;
    let current: typeof sHorizontal | typeof sVertical | typeof sSidebar | null = null;

    const onDragStart = (e: MouseEvent) => {
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
        if (value + columnWidth > 70) {
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
          setColumnWidth(0);
          return;
        }

        setColumnWidth(value);
      } else if (current === sVertical) {
        const value = 100 - Math.round((e.clientY / e.view.innerHeight) * 100);
        if (value > 70) {
          return;
        }
        if (value < 5) {
          setBottomHeight(0);
          return;
        }
        setBottomHeight(value);
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

  const k = panel === 'bottom' ? bottomHeight : columnWidth;
  const mobileNavShown = sidebarWidth !== 0;
  const mobilePanelShown = k !== 0 && mobileNavShown === false;

  const setMobileNavShown = () => {
    setSidebarWidth(30);
    setColumnWidth(0);
    setBottomHeight(0);
  };

  const setMobilePanelShown = () => {
    setColumnWidth(30);
    setBottomHeight(30);
    setSidebarWidth(0);
  };
  const setMobileContentShown = () => {
    setColumnWidth(0);
    setBottomHeight(0);
    setSidebarWidth(0);
  };

  return (
    <>
      <style media="(min-width: 600px)" dangerouslySetInnerHTML={{ __html: DESKTOP }} />
      <style media="(max-width: 599px)" dangerouslySetInnerHTML={{ __html: MOBILE }} />
      <style
        media="(min-width: 600px)"
        dangerouslySetInnerHTML={{ __html: getGridTemplate({ panel, viewMode }) }}
      />
      <div
        className="sb-layout"
        style={{
          gridTemplateColumns: `${sidebarWidth}% 0px 1fr 0 ${columnWidth}%`,
          gridTemplateRows: `1fr 0px ${bottomHeight}%`,
        }}
      >
        <div className="sb-content" hidden={viewMode !== 'story' && viewMode !== 'docs'}>
          {mainContent}
        </div>

        <div className="sb-custom" hidden={!(viewMode !== 'story' && viewMode !== 'docs')}>
          {customContent}
        </div>

        <div className="sb-aside" hidden={sidebarWidth === 0}>
          {sidebarContent}
        </div>
        <div
          className="sb-panel"
          hidden={
            viewMode !== 'story' ||
            (panel === 'bottom' && bottomHeight === 0) ||
            (panel === 'right' && columnWidth === 0) ||
            (panel !== 'right' && panel !== 'bottom')
          }
        >
          {panelContent}
        </div>

        <div
          className="sb-sizer sb-sHorizontal"
          ref={resizer0}
          hidden={panel !== 'right' || viewMode !== 'story'}
        >
          <div className="sb-shade" />
        </div>
        <div
          className="sb-sizer sb-sVertical"
          ref={resizer1}
          hidden={panel !== 'bottom' || viewMode !== 'story'}
        >
          <div className="sb-shade" />
        </div>
        <div className="sb-sizer sb-sSidebar" ref={resizer2}>
          <div className="sb-shade" />
        </div>

        <div className="sb-mobile-control">
          <button type="button" onClick={() => setMobileNavShown()}>
            sidebar {mobileNavShown ? '*' : ''}
          </button>
          <button type="button" onClick={() => setMobileContentShown()}>
            content {!mobileNavShown && !mobilePanelShown ? '*' : ''}
          </button>
          <button
            type="button"
            onClick={() => setMobilePanelShown()}
            hidden={viewMode !== 'story' || (panel !== 'right' && panel !== 'bottom')}
          >
            panel {mobilePanelShown ? '*' : ''}
          </button>
        </div>
      </div>
    </>
  );
};
