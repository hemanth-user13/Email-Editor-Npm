import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { Toolbox } from "./Toolbox";
import { SettingsPanel } from "./SettingsPanel";
import { Paper } from "./Paper";
import { RenderNode } from "./RenderNode";
import { EditorProvider, useEditorConfig } from "./context";
import { DEFAULT_COMPONENTS, buildResolver } from "./defaultComponents";
import { generateEmailHtml } from "../../lib/htmlExporter";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Code,
  Copy,
  Check,
  Undo2,
  Redo2,
  Eye,
  Palette,
  Settings,
  Download,
  LayoutTemplate,
  Layers,
  Paintbrush,
  Moon,
  Sun,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Label } from "../../components/ui/label";
import { createPortal } from "react-dom";

import type {
  EmailEditorProps,
  ComponentRegistry,
  EmailTemplate,
} from "./types";

import {
  Container,
  EmailHeader,
  EmailFooter,
  EmailButton,
  TextBlock,
  InvoiceTable,
  Spacer,
} from "./components";

// ─── Portable Modal (no Tailwind / shadcn dependency) ───────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
  maxHeight?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = 672,
  maxHeight = "85vh",
}) => {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [closeHovered, setCloseHovered] = React.useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-desc" : undefined}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "16px",
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: `${maxWidth}px`,
          maxHeight,
          overflowY: "auto",
          outline: "none",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "none",
            background: closeHovered ? "#f3f4f6" : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: closeHovered ? "#111827" : "#6b7280",
            fontSize: "18px",
            lineHeight: 1,
            padding: 0,
            flexShrink: 0,
            transition: "background 0.15s, color 0.15s",
          }}
        >
          ✕
        </button>

        {/* Header */}
        {(title || description) && (
          <div style={{ padding: "20px 24px 0 24px", flexShrink: 0 }}>
            {title && (
              <h2
                id="modal-title"
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "1.4",
                  color: "#111827",
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-desc"
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#6b7280",
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div
          style={{ padding: "16px 24px 24px 24px", overflowY: "auto", flex: 1 }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ─── Portable Dropdown (no Tailwind / shadcn dependency) ────────────────────

interface DropdownItem {
  key: string;
  label: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: never;
}
interface DropdownSeparator {
  separator: true;
  key: string;
  label?: never;
  onClick?: never;
  danger?: never;
}
type DropdownEntry = DropdownItem | DropdownSeparator;

interface DropdownProps {
  trigger: React.ReactNode;
  label?: string;
  items: DropdownEntry[];
  align?: "start" | "end";
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  label,
  items,
  align = "start",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {/* Menu panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            ...(align === "end" ? { right: 0 } : { left: 0 }),
            zIndex: 9998,
            minWidth: "224px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
            padding: "4px",
            outline: "none",
          }}
        >
          {/* Section label */}
          {label && (
            <div
              style={{
                padding: "6px 8px 4px 8px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </div>
          )}

          {items.map((entry) => {
            if ("separator" in entry && entry.separator) {
              return (
                <div
                  key={entry.key}
                  style={{
                    height: "1px",
                    backgroundColor: "#f3f4f6",
                    margin: "4px 0",
                  }}
                />
              );
            }
            const item = entry as DropdownItem;
            return (
              <DropdownItemRow
                key={item.key}
                item={item}
                onSelect={() => {
                  item.onClick();
                  setOpen(false);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DropdownItemRow: React.FC<{
  item: DropdownItem;
  onSelect: () => void;
}> = ({ item, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "7px 8px",
        fontSize: "13px",
        fontWeight: 400,
        borderRadius: "6px",
        border: "none",
        background: hovered ? "#f9fafb" : "transparent",
        cursor: "pointer",
        color: item.danger ? "#ef4444" : "#111827",
        textAlign: "left",
        transition: "background 0.1s",
      }}
    >
      {item.label}
    </button>
  );
};

// ─── Inline styles shared inside TopBar ─────────────────────────────────────

const modalActionButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 12px",
  fontSize: "13px",
  fontWeight: 500,
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
  color: "#374151",
  transition: "background 0.15s",
};

const codeScrollStyle: React.CSSProperties = {
  height: "400px",
  overflowY: "auto",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
};

const preStyle: React.CSSProperties = {
  padding: "16px",
  fontSize: "12px",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  whiteSpace: "pre-wrap",
  margin: 0,
  color: "#111827",
};

// ─── Color Customizer ───────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { name: "Blue", hsl: "222.2 47.4% 11.2%" },
  { name: "Indigo", hsl: "243 75% 59%" },
  { name: "Emerald", hsl: "160 84% 39%" },
  { name: "Rose", hsl: "346 77% 50%" },
  { name: "Amber", hsl: "32 95% 44%" },
  { name: "Violet", hsl: "263 70% 50%" },
  { name: "Cyan", hsl: "192 91% 36%" },
  { name: "Slate", hsl: "215 20% 35%" },
];

interface ColorCustomizerProps {
  value?: string;
  onColorChange: (primaryHsl: string) => void;
}

const ColorCustomizer = ({ value, onColorChange }: ColorCustomizerProps) => {
  const [customColor, setCustomColor] = useState("#1e293b");

  const applyColor = (hsl: string) => {
    onColorChange(hsl);
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
          <Paintbrush className="h-3.5 w-3.5" />
          Primary
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Primary Color
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyColor(preset.hsl)}
                className="group flex flex-col items-center gap-1"
                title={preset.name}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 transition-all shadow-sm"
                  style={{
                    backgroundColor: `hsl(${preset.hsl})`,
                    borderColor:
                      value === preset.hsl
                        ? "hsl(var(--foreground))"
                        : "transparent",
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-border">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Custom Color
            </Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  applyColor(hexToHsl(e.target.value));
                }}
                className="w-10 h-8 rounded border border-border cursor-pointer bg-background"
              />
              <span className="text-xs text-muted-foreground font-mono">
                {customColor}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ─── TopBar (internal) ──────────────────────────────────────────────────────

interface TopBarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  primaryColor?: string;
  onPrimaryColorChange: (primaryHsl: string) => void;
}

const TopBar = ({
  isDarkMode,
  onToggleDarkMode,
  primaryColor,
  onPrimaryColorChange,
}: TopBarProps) => {
  const { actions, query, canUndo, canRedo } = useEditor((state, queryCtx) => ({
    canUndo: state.options.enabled && queryCtx.history.canUndo(),
    canRedo: state.options.enabled && queryCtx.history.canRedo(),
  }));

  const { title, logo, templates, callbacks, slots, htmlRenderers } =
    useEditorConfig();

  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );

  const getHtml = useCallback(() => {
    const json = query.serialize();
    const nodes = JSON.parse(json);
    return generateEmailHtml(nodes, htmlRenderers);
  }, [query, htmlRenderers]);

  const handleExport = () => {
    const html = getHtml();
    setHtmlCode(html);
    setShowCode(true);
    callbacks.onExport?.(html);
  };

  const handlePreview = () => {
    const html = getHtml();
    setHtmlCode(html);
    setShowPreview(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearCanvas = () => {
    actions.clearEvents();
    actions.deserialize(`{
      "ROOT": {
        "type": {"resolvedName": "Paper"},
        "isCanvas": true,
        "props": {"background": "#ffffff"},
        "displayName": "Paper",
        "custom": {},
        "hidden": false,
        "nodes": [],
        "linkedNodes": {}
      }
    }`);
    callbacks.onClear?.();
  };

  const handleLoadTemplate = (template: EmailTemplate) => {
    try {
      actions.deserialize(template.data);
      callbacks.onTemplateLoad?.(template.id);
    } catch (e) {
      console.error("Failed to load template:", e);
    }
  };

  if (slots.toolbar) {
    return React.createElement(slots.toolbar, {
      onExport: getHtml,
      onPreview: getHtml,
      onClear: handleClearCanvas,
      title,
      logo,
    });
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          </div>

          <div className="h-5 w-px bg-border" />

          <Dropdown
            align="start"
            label="Quick Start Templates"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
              >
                <LayoutTemplate className="h-3.5 w-3.5" />
                Templates
              </Button>
            }
            items={[
              ...templates.map((template) => ({
                key: template.id,
                label: (
                  <React.Fragment>
                    {template.icon &&
                      React.createElement(template.icon, {
                        style: {
                          width: 14,
                          height: 14,
                          color: "#9ca3af",
                          flexShrink: 0,
                        },
                      })}
                    <div>
                      <div style={{ fontWeight: 500, fontSize: "13px" }}>
                        {template.name}
                      </div>
                      {template.description && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#9ca3af",
                            marginTop: 1,
                          }}
                        >
                          {template.description}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ),
                onClick: () => handleLoadTemplate(template),
              })),
              ...(templates.length > 0
                ? [{ key: "sep-clear", separator: true as const }]
                : []),
              {
                key: "clear",
                label: "Clear Canvas",
                onClick: handleClearCanvas,
                danger: true,
              },
            ]}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canUndo}
              onClick={() => actions.history.undo()}
              className="h-7 w-7 p-0"
              title="Undo"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canRedo}
              onClick={() => actions.history.redo()}
              className="h-7 w-7 p-0"
              title="Redo"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="gap-1.5 h-8 text-xs"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            className="gap-1.5 h-8 text-xs"
          >
            <Code className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Export HTML Modal */}
      <Modal
        open={showCode}
        onClose={() => setShowCode(false)}
        title="Export HTML"
        description="Copy this HTML code to use in your email client or system."
        maxWidth={896}
        maxHeight="80vh"
      >
        {slots.exportDialog ? (
          React.createElement(slots.exportDialog, {
            html: htmlCode,
            onClose: () => setShowCode(false),
          })
        ) : (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button
                onClick={handleCopy}
                style={modalActionButtonStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#ffffff")
                }
              >
                {copied ? (
                  <Check size={14} style={{ marginRight: 6 }} />
                ) : (
                  <Copy size={14} style={{ marginRight: 6 }} />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                style={modalActionButtonStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#ffffff")
                }
              >
                <Download size={14} style={{ marginRight: 6 }} />
                Download
              </button>
            </div>
            <div style={codeScrollStyle}>
              <pre style={preStyle}>{htmlCode}</pre>
            </div>
          </>
        )}
      </Modal>

      {/* Email Preview Modal */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Email Preview"
        description="Preview how your email will look in email clients."
        maxWidth={1024}
        maxHeight="90vh"
      >
        {slots.previewDialog ? (
          React.createElement(slots.previewDialog, {
            html: htmlCode,
            onClose: () => setShowPreview(false),
          })
        ) : (
          <div style={{ overflowY: "auto", maxHeight: "600px" }}>
            <div
              style={{
                margin: "0 auto",
                transition: "max-width 0.3s",
                maxWidth: previewDevice === "mobile" ? "375px" : "100%",
              }}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "rgba(243,244,246,0.3)",
                  overflow: "hidden",
                }}
              >
                {previewDevice === "mobile" && (
                  <div
                    style={{
                      height: "24px",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "4px",
                        background: "rgba(107,114,128,0.3)",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                )}
                <iframe
                  srcDoc={htmlCode}
                  title="Email Preview"
                  style={{
                    width: "100%",
                    minHeight: "500px",
                    background: "#ffffff",
                    border: "none",
                    display: "block",
                    height: previewDevice === "mobile" ? "667px" : "600px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

// ─── Left Sidebar with Tabs ─────────────────────────────────────────────────
//@ts-ignore
const LeftSidebar = ({ setActiveTab, activeTab }) => {
  const { components, slots } = useEditorConfig();
  const { selectedNodeId } = useEditor((state) => ({
    //@ts-ignore
    selectedNodeId: state.events.selected[0],
  }));

  useEffect(() => {
    if (selectedNodeId) {
      setActiveTab("properties");
    }
  }, [selectedNodeId]);

  const categories = useMemo(() => {
    return Object.keys(components).reduce<string[]>((acc, k) => {
      const cat = components[k].category || "Other";
      if (!acc.includes(cat)) acc.push(cat);
      return acc;
    }, []);
  }, [components]);

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "components" | "properties")
        }
        className="flex-1 flex flex-col"
      >
        <div className="px-2 pt-2 border-b border-border">
          <TabsList className="w-full h-9 bg-muted/50">
            <TabsTrigger
              value="components"
              className="flex-1 gap-1.5 text-xs data-[state=active]:bg-background"
            >
              <Layers className="h-3.5 w-3.5" />
              Components
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="flex-1 gap-1.5 text-xs data-[state=active]:bg-background"
            >
              <Settings className="h-3.5 w-3.5" />
              Properties
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="components" className="flex-1 mt-0 ">
          <ScrollArea className="h-full max-h-[180vh]  ">
            {slots.toolbox ? (
              React.createElement(slots.toolbox, { components, categories })
            ) : (
              <Toolbox />
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="properties" className="flex-1 mt-0 ">
          <div className="h-full">
            <SettingsPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ─── Default content ────────────────────────────────────────────────────────

const defaultEmailContent = <Element is={Paper} canvas></Element>;

// ─── Main EmailEditor Component ─────────────────────────────────────────────

const getReadablePrimaryForeground = (primaryHsl: string): string => {
  const lightness = Number.parseFloat(
    primaryHsl.trim().split(/\s+/)[2]?.replace("%", "") || "50",
  );
  return lightness > 60 ? "222.2 47.4% 11.2%" : "210 40% 98%";
};

type CssVariablesStyle = React.CSSProperties & Record<`--${string}`, string>;

export const EmailEditor: React.FC<EmailEditorProps> = ({
  components: userComponents,
  replaceBuiltins = false,
  theme = {},
  slots = {},
  templates = [],
  callbacks = {},
  initialState,
  defaultContent,
  title = "Email Editor",
  logo,
  htmlRenderers = {},
  showToolbar = true,
  showToolbox = true,
  darkMode = true,
  className,
  style,
}) => {
  const mergedComponents = useMemo<ComponentRegistry>(() => {
    if (replaceBuiltins) return userComponents || {};
    return { ...DEFAULT_COMPONENTS, ...(userComponents || {}) };
  }, [userComponents, replaceBuiltins]);

  const [activeTab, setActiveTab] = useState<"components" | "properties">(
    "components",
  );

  const resolver = useMemo(() => {
    const res = buildResolver(mergedComponents);
    res.Paper = Paper;
    return res;
  }, [mergedComponents]);

  const renderNodeFn = (slots.renderNode || RenderNode) as any;

  const [isDarkMode, setIsDarkMode] = useState(!darkMode);
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(
    theme.colors?.primary,
  );

  useEffect(() => {
    setPrimaryColor(theme.colors?.primary);
  }, [theme.colors?.primary]);

  const primaryForeground = useMemo(() => {
    if (theme.colors?.primaryForeground) return theme.colors.primaryForeground;
    if (!primaryColor) return undefined;
    return getReadablePrimaryForeground(primaryColor);
  }, [primaryColor, theme.colors?.primaryForeground]);

  const themeColorVars = useMemo(() => {
    const colors = theme.colors || {};
    return {
      background: colors.background,
      foreground: colors.foreground,
      border: colors.border,
      muted: colors.muted,
      "muted-foreground": colors.mutedForeground,
      destructive: colors.destructive,
      "panel-background": colors.panelBackground,
      "canvas-background": colors.canvasBackground,
    };
  }, [theme.colors]);

  const editorStyle = useMemo(() => {
    const cssVars: CssVariablesStyle = { ...(style || {}) };

    Object.entries(themeColorVars).forEach(([token, value]) => {
      if (value) cssVars[`--${token}`] = value;
    });

    if (primaryColor) cssVars["--primary"] = primaryColor;
    if (primaryForeground) cssVars["--primary-foreground"] = primaryForeground;
    if (theme.borderRadius) cssVars["--radius"] = `${theme.borderRadius}px`;
    if (theme.fontFamily) cssVars.fontFamily = theme.fontFamily;

    return cssVars;
  }, [
    style,
    themeColorVars,
    primaryColor,
    primaryForeground,
    theme.borderRadius,
    theme.fontFamily,
  ]);

  return (
    <EditorProvider
      value={{
        components: mergedComponents,
        theme,
        slots,
        templates,
        callbacks,
        htmlRenderers,
        title,
        logo,
        showToolbar,
        showToolbox,
        showSettingsPanel: false,
      }}
    >
      <div
        className={`h-screen flex flex-col ${isDarkMode ? "dark" : ""} bg-background text-foreground ${className || ""}`}
        style={editorStyle}
      >
        <Editor resolver={resolver} onRender={renderNodeFn}>
          {showToolbar && (
            <TopBar
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              primaryColor={primaryColor}
              onPrimaryColorChange={(primaryHsl) => {
                setPrimaryColor(primaryHsl);
                callbacks.onColorChange?.(primaryHsl);
              }}
            />
          )}
          <div className="flex-1 flex">
            {showToolbox && (
              <div className="w-auto max-w-96 flex-shrink-0">
                <LeftSidebar
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                />
              </div>
            )}

            <div
              className="flex-1 overflow-auto craftjs-renderer"
              style={{
                backgroundColor:
                  theme.colors?.canvasBackground || "hsl(var(--muted))",
              }}
            >
              <div
                className="p-8"
                onClick={() => {
                  setActiveTab("properties");
                }}
              >
                <Frame data={initialState}>{defaultEmailContent}</Frame>
              </div>
            </div>
          </div>
        </Editor>
      </div>
    </EditorProvider>
  );
};
