import React from "react";
import { useEditor } from "@craftjs/core";
import {
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layers,
  Paintbrush,
  Settings2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useEditorConfig } from "./context";

export const SettingsPanel = () => {
  const { slots } = useEditorConfig();

  const { selected, actions, query } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        displayName:
          state.nodes[currentNodeId].data.displayName ||
          state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related?.settings,
        isDeletable: state.nodes[currentNodeId].data.name !== "Paper",
        parent: state.nodes[currentNodeId].data.parent,
        props: state.nodes[currentNodeId].data.props,
      };
    }

    return { selected };
  });

  const handleDuplicate = () => {
    if (!selected || !selected.isDeletable) return;
    const node = query.node(selected.id).get();
    const parent = node.data.parent;
    if (parent) {
      try {
        const serializedNode = query.node(selected.id).toSerializedNode();
        const parentNode = query.node(parent).get();
        const siblings = parentNode.data.nodes || [];
        const currentIndex = siblings.indexOf(selected.id);
        const newNode = query
          .parseSerializedNode(serializedNode)
          .toNode((node) => {
            node.id = `${node.data.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            return node;
          });
        actions.addNodeTree(
          { rootNodeId: newNode.id, nodes: { [newNode.id]: newNode } },
          parent,
          currentIndex + 1,
        );
      } catch (e) {
        console.log("Duplicate error:", e);
      }
    }
  };

  const handleMoveUp = () => {
    if (!selected || !selected.parent) return;
    const parentNode = query.node(selected.parent).get();
    const siblings = parentNode.data.nodes || [];
    const currentIndex = siblings.indexOf(selected.id);
    if (currentIndex > 0) {
      actions.move(selected.id, selected.parent, currentIndex - 1);
    }
  };

  const handleMoveDown = () => {
    if (!selected || !selected.parent) return;
    const parentNode = query.node(selected.parent).get();
    const siblings = parentNode.data.nodes || [];
    const currentIndex = siblings.indexOf(selected.id);
    if (currentIndex < siblings.length - 1) {
      actions.move(selected.id, selected.parent, currentIndex + 2);
    }
  };

  // Use custom slot for settings panel
  if (slots.settingsPanel && selected) {
    return React.createElement(slots.settingsPanel, {
      selectedId: selected.id,
      selectedName: selected.displayName || selected.name,
      //@ts-ignore
      selectedSettings: selected.settings,
      onDelete: selected.isDeletable
        ? () => actions.delete(selected.id)
        : undefined,
      onDuplicate: handleDuplicate,
      onMoveUp: handleMoveUp,
      onMoveDown: handleMoveDown,
    });
  }

  if (!selected) {
    if (slots.settingsEmptyState) {
      return React.createElement(slots.settingsEmptyState);
    }

    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Layers className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-2">
          No Element Selected
        </h3>
        <p className="text-sm text-muted-foreground">
          Click on a component in the canvas to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h3 className="font-semibold text-sm">
              {selected.displayName || selected.name}
            </h3>
          </div>
        </div>

        {selected.isDeletable && (
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleMoveUp}
              title="Move Up"
            >
              <ChevronUp className="h-3.5 w-3.5 mr-1" /> Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleMoveDown}
              title="Move Down"
            >
              <ChevronDown className="h-3.5 w-3.5 mr-1" /> Down
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => actions.delete(selected.id)}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {selected.settings ? (
            <Accordion type="multiple" defaultValue={["content"]}>
              <AccordionItem value="content" className="border-b">
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    <span>Properties</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  {React.createElement(selected.settings)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              <Paintbrush className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No editable properties</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-muted/20 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Component: {selected.name}</span>
          <span className="font-mono text-[10px]">
            {selected.id.slice(0, 8)}
          </span>
        </div>
      </div>
    </div>
  );
};
