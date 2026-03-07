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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Label } from "../../components/ui/label";

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
            {/* {logo || (
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Palette className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )} */}
            <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          </div>

          <div className="h-5 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
              >
                <LayoutTemplate className="h-3.5 w-3.5" />
                Templates
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Quick Start Templates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {templates.map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  className="gap-2"
                  onClick={() => handleLoadTemplate(template)}
                >
                  {template.icon &&
                    React.createElement(template.icon, {
                      className: "h-4 w-4 text-muted-foreground",
                    })}
                  <div>
                    <div className="font-medium">{template.name}</div>
                    {template.description && (
                      <div className="text-xs text-muted-foreground">
                        {template.description}
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              {templates.length > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={handleClearCanvas}
                className="text-destructive"
              >
                Clear Canvas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDarkMode}
            className="gap-1.5 h-8 text-xs"
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
            {isDarkMode ? "Light" : "Dark"}
          </Button>

          <ColorCustomizer
            value={primaryColor}
            onColorChange={onPrimaryColorChange}
          />

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

      {/* Export Dialog */}
      <Dialog open={showCode} onOpenChange={setShowCode}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Export HTML</DialogTitle>
            <DialogDescription>
              Copy this HTML code to use in your email client or system.
            </DialogDescription>
          </DialogHeader>
          {slots.exportDialog ? (
            React.createElement(slots.exportDialog, {
              html: htmlCode,
              onClose: () => setShowCode(false),
            })
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
              <ScrollArea className="h-[400px] border rounded-md">
                <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                  {htmlCode}
                </pre>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Email Preview</span>
            </DialogTitle>
            <DialogDescription>
              Preview how your email will look in email clients.
            </DialogDescription>
          </DialogHeader>
          {slots.previewDialog ? (
            React.createElement(slots.previewDialog, {
              html: htmlCode,
              onClose: () => setShowPreview(false),
            })
          ) : (
            <ScrollArea className="h-[600px]">
              <div
                className={`mx-auto transition-all duration-300 ${previewDevice === "mobile" ? "max-w-[375px]" : "max-w-full"}`}
              >
                <div className="border rounded-lg bg-muted/30 overflow-hidden">
                  {previewDevice === "mobile" && (
                    <div className="h-6 bg-muted flex items-center justify-center">
                      <div className="w-16 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                  )}
                  <iframe
                    srcDoc={htmlCode}
                    className="w-full min-h-[500px] bg-white"
                    title="Email Preview"
                    style={{
                      height: previewDevice === "mobile" ? "667px" : "600px",
                    }}
                  />
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
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
