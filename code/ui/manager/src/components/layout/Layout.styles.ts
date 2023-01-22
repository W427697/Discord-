import type { LayoutState } from './Layout.types';

const MARGIN = 10;

export const SHARED = `
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

export const DESKTOP = `

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

.sb-sidebar { 
  grid-area: sidebar;
  position: relative;
  z-index: 3;
}
.sb-content { 
  grid-area: content;
  position: relative;
  z-index: 1;
}
.sb-custom { 
  grid-area: other;
  position: relative;
  z-index: 1;
}
.sb-panel { 
  grid-area: panel;
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
.sb-mobile-dismiss {
  display: none;
}

.sb-horizontalDrag {
  grid-area: horizontalDrag;
  width: ${MARGIN * 2}px;
  margin-left: -${MARGIN}px;
  cursor: col-resize;
  top: 100px;
  bottom: 100px;
}
.sb-horizontalDrag .sb-shade {
  transform: rotate(180deg);
  left: 0;
}
.sb-verticalDrag .sb-shade {
  // transform: rotate(90deg);
  left: 0;
  width: 100%;
  transform: rotate(180deg);
  height: ${MARGIN}px;
  background-size: 100% ${MARGIN * 2}px;
  background-position: 50% ${MARGIN}px;

}

.sb-verticalDrag {
  grid-area: verticalDrag;
  height: ${MARGIN * 2}px;
    margin-top: -${MARGIN}px;
  cursor: row-resize;
  left: 100px;
  right: 100px;
}
.sb-sidebarDrag {
  grid-area: sidebarDrag;
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
  background: radial-gradient(at center center, #1EA7FD 0%,transparent 50%,transparent 100%);
  background-size: ${MARGIN * 2}px 100%;
  background-position: ${MARGIN}px 50%;
  opacity: 0;
  transition: opacity 0.2s;
}
`;
export const MOBILE = `
.sb-sidebar { 
  position: absolute;
  top: 0;
  left: 0;
  bottom: 40px;
  right: 30%;
  transform: translateX(0%);
  transition: transform 0.3s;
  z-index: 4;
}
.sb-sidebar[hidden] { 
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

.sb-mobile-dismiss {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  height: 100vh;
  width: 100vw;
}

.sb-sidebar:not([hidden]) + .sb-panel {
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
  z-index: 3;
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

export function getGridTemplate({ panelPosition, viewMode }: LayoutState) {
  if (viewMode !== 'story' && viewMode !== 'docs') {
    return `
    .sb-layout {
      grid-template-areas: 
        "sidebar sidebarDrag other other other"
        "sidebar sidebarDrag other other other"
        "sidebar sidebarDrag other other other"; 
    }`;
  }

  if (viewMode !== 'story') {
    return `
    .sb-layout {
      grid-template-areas: 
        "sidebar sidebarDrag content content content"
        "sidebar sidebarDrag content content content"
        "sidebar sidebarDrag content content content"; 
    }`;
  }

  if (panelPosition === 'right') {
    return `
    .sb-layout {
      grid-template-areas: 
        "sidebar sidebarDrag content horizontalDrag panel"
        "sidebar sidebarDrag content horizontalDrag panel"
        "sidebar sidebarDrag content horizontalDrag panel"; 
    }`;
  }

  return `
    .sb-layout {
      grid-template-areas: 
        "sidebar sidebarDrag content content content"
        "sidebar sidebarDrag verticalDrag verticalDrag verticalDrag"
        "sidebar sidebarDrag panel panel panel"; 
    }`;
}
