import React from "react";
import { useNode } from "@craftjs/core";

interface RawHtmlProps {
  html?: string;
  padding?: number;
}

export const RawHtml = ({
  html = '<p style="font-family: Arial, sans-serif; color: #333;">Paste your raw HTML here...</p>',
  padding = 0,
}: RawHtmlProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{ padding: `${padding}px`, position: "relative" }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "#6366f1",
            color: "#fff",
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
            zIndex: 10,
            fontFamily: "monospace",
          }}
        >
          RAW HTML
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

const RawHtmlSettings = () => {
  const {
    actions: { setProp },
    html,
    padding,
  } = useNode((node) => ({
    html: node.data.props.html,
    padding: node.data.props.padding,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">HTML Code</label>
        <textarea
          value={html || ""}
          onChange={(e) =>
            setProp((props: RawHtmlProps) => (props.html = e.target.value))
          }
          className="w-full px-3 py-2 border rounded-md text-sm min-h-[200px] font-mono"
          placeholder="<table>...</table>"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={40}
          value={padding || 0}
          onChange={(e) =>
            setProp(
              (props: RawHtmlProps) =>
                (props.padding = parseInt(e.target.value)),
            )
          }
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

RawHtml.craft = {
  props: {
    html: '<p style="font-family: Arial, sans-serif; color: #333;">Paste your raw HTML here...</p>',
    padding: 0,
  },
  related: {
    settings: RawHtmlSettings,
  },
};
