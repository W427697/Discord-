import type { Dispatch, MutableRefObject } from 'react';
import React, { useEffect, useRef } from 'react';
import type { LayoutState } from './Layout.types';

export const DesktopControls = ({
  state,
  updateState,
  stateRef,
}: {
  updateState: (state: Partial<LayoutState>) => void;
  stateRef: React.MutableRefObject<LayoutState>;
  state: LayoutState;
}) => {
  const { sHorizontalRef, sSidebarRef, sVerticalRef } = useDragging(updateState, stateRef);

  return (
    <>
      <div
        className="sb-sizer sb-horizontalDrag"
        ref={sHorizontalRef}
        hidden={!(state.panelPosition === 'right' && state.viewMode === 'story')}
      >
        <div className="sb-shade" />
      </div>
      <div
        className="sb-sizer sb-verticalDrag"
        ref={sVerticalRef}
        hidden={!(state.panelPosition === 'bottom' && state.viewMode === 'story')}
      >
        <div className="sb-shade" />
      </div>
      <div className="sb-sizer sb-sidebarDrag" ref={sSidebarRef}>
        <div className="sb-shade" />
      </div>

      <div className="sb-hoverblock" hidden={!state.isDragging} />
    </>
  );
};
function useDragging(
  updateState: Dispatch<Partial<LayoutState>>,
  stateRef: MutableRefObject<LayoutState>
) {
  const sHorizontalRef = useRef<HTMLDivElement>(null);
  const sVerticalRef = useRef<HTMLDivElement>(null);
  const sSidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sHorizontal = sHorizontalRef.current;
    const sVertical = sVerticalRef.current;
    const sSidebar = sSidebarRef.current;
    let draggedElement: typeof sHorizontal | typeof sVertical | typeof sSidebar | null = null;

    const onDragStart = (e: MouseEvent) => {
      e.preventDefault();

      updateState({
        isDragging: true,
      });
      if (e.currentTarget === sHorizontal) {
        draggedElement = sHorizontal;
      } else if (e.currentTarget === sVertical) {
        draggedElement = sVertical;
      } else if (e.currentTarget === sSidebar) {
        draggedElement = sSidebar;
      }
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', onDragEnd);
    };

    const onDragEnd = (e: MouseEvent) => {
      updateState({
        isDragging: false,
      });
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onDragEnd);
    };

    const onDrag = (e: MouseEvent) => {
      if (e.buttons === 0) {
        onDragEnd(e);
        return;
      }

      if (draggedElement === sSidebar) {
        const value = Math.round((e.clientX / e.view.innerWidth) * 100);
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
      if (draggedElement === sHorizontal) {
        const value = 100 - Math.round((e.clientX / e.view.innerWidth) * 100);
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
        return;
      }
      if (draggedElement === sVertical) {
        const value = 100 - ((e.clientY / e.view.innerHeight) * 100);
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
  }, [stateRef, updateState]);

  return { sHorizontalRef, sVerticalRef, sSidebarRef };
}
