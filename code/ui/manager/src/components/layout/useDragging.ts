import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import type { LayoutState } from './Layout.types';

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
          const value = (e.clientX / e.view.innerWidth) * 100;
          if (value + state.rightPanelWidth > 70) {
            // preserve space for content
            return state;
          }

          if (value < 5) {
            if (state.navSize !== 0) {
              return {
                ...state,
                navSize: 0,
              };
            }
          } else if (value !== state.navSize) {
            return {
              ...state,
              navSize: value,
            };
          }

          return state;
        }
        if (draggedElement === panelResizer) {
          if (state.panelPosition === 'bottom') {
            const value = 100 - (e.clientY / e.view.innerHeight) * 100;
            if (value > 70) {
              return state;
            }
            if (value < 5) {
              if (state.bottomPanelHeight !== 0) {
                return {
                  ...state,
                  bottomPanelHeight: 0,
                };
              }
            } else if (value !== state.bottomPanelHeight) {
              return {
                ...state,
                bottomPanelHeight: value,
              };
            }
          } else {
            const value = 100 - (e.clientX / e.view.innerWidth) * 100;
            if (value + state.navSize > 70) {
              // preserve space for content
              return state;
            }

            if (value < 5) {
              if (state.rightPanelWidth !== 0) {
                return {
                  ...state,
                  rightPanelWidth: 0,
                };
              }
            } else if (value !== state.rightPanelWidth) {
              return {
                ...state,
                rightPanelWidth: value,
              };
            }
          }
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
