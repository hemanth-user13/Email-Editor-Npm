import React from "react";
import { useEditor, Element } from "@craftjs/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useEditorConfig } from "./context";
import type { EditorComponentConfig } from "./types";

interface ToolboxItemProps {
  name: string;
  config: EditorComponentConfig;
}

const ToolboxItem = ({ name, config }: ToolboxItemProps) => {
  const { connectors } = useEditor();
  const Component = config.component;
  const element = config.createElement ? config.createElement() : <Component />;
  const IconComp = config.icon;

  return (
    <div
      ref={(ref) => ref && connectors.create(ref, element)}
      className="flex items-center gap-3 p-2.5 border rounded-lg cursor-grab hover:bg-accent hover:border-primary/50 transition-all group"
      title={config.description}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {IconComp && <IconComp className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground block truncate">
          {config.label}
        </span>
        {config.description && (
          <span className="text-xs text-muted-foreground block truncate">
            {config.description}
          </span>
        )}
      </div>
    </div>
  );
};

export const Toolbox = () => {
  const { components } = useEditorConfig();

  // Group components by category
  const grouped = React.useMemo(() => {
    const map: Record<string, Array<[string, EditorComponentConfig]>> = {};
    for (const [name, config] of Object.entries(components)) {
      const cat = config.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push([name, config]);
    }
    return map;
  }, [components]);

  const categoryKeys = Object.keys(grouped);

  return (
    <div className="p-3">
      <Accordion type="multiple" defaultValue={categoryKeys}>
        {categoryKeys.map((category, idx) => (
          <AccordionItem
            key={category}
            value={category}
            className={
              idx < categoryKeys.length - 1 ? "border-b" : "border-b-0"
            }
          >
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
              {category}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-2">
                {grouped[category].map(([name, config]) => (
                  <ToolboxItem key={name} name={name} config={config} />
                ))}
              </div>
              {category === "Dynamic" && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Use variables like{" "}
                    <code className="bg-primary/10 text-primary px-1 rounded">
                      {"{{first_name}}"}
                    </code>{" "}
                    for personalized emails
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
