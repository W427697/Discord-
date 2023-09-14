import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import type { LayoutState } from './Layout';

// the distance from the edge of the screen at which the panel/sidebar will snap to the edge
const SNAP_THRESHOLD_PX = 50;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useDragging(
  setState: Dispatch<SetStateAction<LayoutState>>,
  isPanelShown: boolean
) {
  const panelResizerRef = useRef<HTMLDivElement>(null);
  const sidebarResizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panelResizer = panelResizerRef.current;
    const sidebarResizer = sidebarResizerRef.current;
    const previewIframe = document.querySelector('#storybook-preview-iframe') as HTMLIFrameElement;
    let draggedElement: typeof panelResizer | typeof sidebarResizer | null = null;

    const onDragStart = (e: MouseEvent) => {
      e.preventDefault();

      setState((state) => ({
        ...state,
        isDragging: true,
      }));

      if (e.currentTarget === panelResizer) {
        draggedElement = panelResizer;
      } else if (e.currentTarget === sidebarResizer) {
        draggedElement = sidebarResizer;
      }
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', onDragEnd);

      if (previewIframe) {
        // prevent iframe from capturing mouse events
        previewIframe.style.pointerEvents = 'none';
      }
    };

    const onDragEnd = (e: MouseEvent) => {
      setState((state) => ({
        ...state,
        isDragging: false,
      }));
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onDragEnd);
      // make iframe capture pointer events again
      previewIframe?.removeAttribute('style');
    };

    const onDrag = (e: MouseEvent) => {
      if (e.buttons === 0) {
        onDragEnd(e);
        return;
      }

      setState((state) => {
        if (draggedElement === sidebarResizer) {
          const sidebarWidth = e.clientX;

          if (sidebarWidth === state.navSize) {
            return state;
          }
          if (sidebarWidth <= SNAP_THRESHOLD_PX) {
            return {
              ...state,
              navSize: 0,
            };
          }
          return {
            ...state,
            navSize: clamp(sidebarWidth, 0, e.view.innerWidth),
          };
        }
        if (draggedElement === panelResizer) {
          const sizeAxisState =
            state.panelPosition === 'bottom' ? 'bottomPanelHeight' : 'rightPanelWidth';
          const panelSize =
            state.panelPosition === 'bottom'
              ? e.view.innerHeight - e.clientY
              : e.view.innerWidth - e.clientX;

          if (panelSize === state[sizeAxisState]) {
            return state;
          }
          if (panelSize <= SNAP_THRESHOLD_PX) {
            return {
              ...state,
              [sizeAxisState]: 0,
            };
          }
          const sizeAxisMax =
            state.panelPosition === 'bottom' ? e.view.innerHeight : e.view.innerWidth;
          return {
            ...state,
            [sizeAxisState]: clamp(panelSize, 0, sizeAxisMax),
          };
        }
        return state;
      });
    };

    panelResizer?.addEventListener('mousedown', onDragStart);
    sidebarResizer?.addEventListener('mousedown', onDragStart);

    return () => {
      panelResizer?.removeEventListener('mousedown', onDragStart);
      sidebarResizer?.removeEventListener('mousedown', onDragStart);
      // make iframe capture pointer events again
      previewIframe?.removeAttribute('style');
    };
  }, [
    isPanelShown, // we need to rerun this effect when the panel is shown/hidden to re-attach the event listeners
    setState,
  ]);

  return { panelResizerRef, sidebarResizerRef };
}
