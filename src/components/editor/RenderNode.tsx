import React, { useCallback, useEffect } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { Move, ArrowUp } from 'lucide-react';

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
  }));

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) {
        dom.classList.add('component-selected');
      } else {
        dom.classList.remove('component-selected');
      }
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom: HTMLElement | null) => {
    const { top, left, bottom } = dom ? dom.getBoundingClientRect() : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    const currentDOM = dom;
    if (!currentDOM) return;
    const { top, left } = getPos(currentDOM);
    // Update indicator position if needed
  }, [dom, getPos]);

  useEffect(() => {
    document.querySelector('.craftjs-renderer')?.addEventListener('scroll', scroll);
    return () => {
      document.querySelector('.craftjs-renderer')?.removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  return (
    <>
      {isHover || isActive ? (
        <div
          className="absolute -top-7 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded flex items-center gap-1 z-50"
          style={{
            pointerEvents: 'auto',
          }}
        >
          {moveable && (
            <span
              ref={(ref) => ref && drag(ref)}
              className="cursor-grab"
            >
              <Move className="h-3 w-3" />
            </span>
          )}
          <span>{name}</span>
          {parent && (
            <button
              onClick={() => actions.selectNode(parent)}
              className="ml-1 hover:bg-primary-foreground/20 rounded p-0.5"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : null}
      {render}
    </>
  );
};
