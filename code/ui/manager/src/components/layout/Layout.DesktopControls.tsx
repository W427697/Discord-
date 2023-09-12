import type { Dispatch, MutableRefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { LayoutState } from './Layout.types';

export function useDragging(
  updateState: Dispatch<Partial<LayoutState>>,
  stateRef: MutableRefObject<LayoutState>
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

      updateState({
        isDragging: true,
      });
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
      updateState({
        isDragging: false,
      });
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

      if (draggedElement === sidebarResizer) {
        const value = (e.clientX / e.view.innerWidth) * 100;
        if (value + stateRef.current.panelWidth > 70) {
          // preserve space for content
          return;
        }

        if (value < 5) {
          if (stateRef.current.sidebarWidth !== 0) {
            updateState({
              isSidebarShown: false,
              sidebarWidth: 0,
            });
          }
        } else if (value !== stateRef.current.sidebarWidth) {
          updateState({ isSidebarShown: true, sidebarWidth: value });
        }
        return;
      }
      if (draggedElement === panelResizer) {
        if (stateRef.current.panelPosition === 'bottom') {
          const value = 100 - (e.clientY / e.view.innerHeight) * 100;
          if (value > 70) {
            return;
          }
          if (value < 5) {
            if (stateRef.current.panelHeight !== 0) {
              updateState({ isPanelShown: false, panelHeight: 0 });
            }
          } else if (value !== stateRef.current.panelHeight) {
            updateState({ isPanelShown: true, panelHeight: value });
          }
        } else {
          const value = 100 - (e.clientX / e.view.innerWidth) * 100;
          if (value + stateRef.current.sidebarWidth > 70) {
            // preserve space for content
            return;
          }

          if (value < 5) {
            if (stateRef.current.panelWidth !== 0) {
              updateState({ isPanelShown: false, panelWidth: 0 });
            }
          } else if (value !== stateRef.current.panelWidth) {
            updateState({ isPanelShown: true, panelWidth: value });
          }
        }
      }
    };

    panelResizer?.addEventListener('mousedown', onDragStart);
    sidebarResizer?.addEventListener('mousedown', onDragStart);

    return () => {
      panelResizer?.removeEventListener('mousedown', onDragStart);
      sidebarResizer?.removeEventListener('mousedown', onDragStart);
      // make iframe capture pointer events again
      previewIframe?.removeAttribute('style');
    };
  }, [stateRef, updateState]);

  return { panelResizerRef, sidebarResizerRef };
}
