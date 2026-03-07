import React, { useState, useMemo, useCallback } from "react";
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
  Code,
  Copy,
  Check,
  Undo2,
  Redo2,
  Eye,
  Palette,
  Settings,
  Download,
  FileText,
  Sparkles,
  LayoutTemplate,
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

import type {
  EmailEditorProps,
  ComponentRegistry,
  EditorTheme,
  EditorSlots,
  EmailTemplate,
  EditorCallbacks,
  HtmlRenderer,
} from "./types";

import {
  Container,
  EmailHeader,
  EmailFooter,
  EmailButton,
  TextBlock,
  ImageBlock,
  Divider,
  InvoiceTable,
  Spacer,
  SocialLinks,
  TwoColumn,
  Countdown,
  PromoCode,
  Testimonial,
  VideoPlaceholder,
  VariableText,
  IconList,
} from "./components";

// ─── TopBar (internal) ──────────────────────────────────────────────────────

const TopBar = () => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: state.options.enabled && query.history.canUndo(),
    canRedo: state.options.enabled && query.history.canRedo(),
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

  // Custom toolbar slot
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
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {logo || (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Palette className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold leading-tight">{title}</h1>
              <p className="text-[10px] text-muted-foreground">
                Drag & Drop Builder
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <LayoutTemplate className="h-4 w-4" />
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canUndo}
              onClick={() => actions.history.undo()}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canRedo}
              onClick={() => actions.history.redo()}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-px h-6 bg-border" />
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="gap-2"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Code className="h-4 w-4" /> Export HTML
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
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {/* <Button
                  variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                  className="h-7 px-3 text-xs"
                >
                  Desktop
                </Button> */}
                {/* <Button variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('mobile')} className="h-7 px-3 text-xs">Mobile</Button> */}
              </div>
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
                  {/* {previewDevice === 'mobile' && (
                    <div className="h-6 bg-muted flex items-center justify-center">
                      <div className="w-16 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                  )} */}
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

// ─── Default content ────────────────────────────────────────────────────────

const defaultEmailContent = (
  <Element is={Paper} canvas>
    <EmailHeader />
    <Element is={Container} canvas>
      <TextBlock
        text="Thank you for your business! Please find your invoice details below."
        fontSize={16}
        align="center"
      />
      <Spacer height={10} />
      <InvoiceTable />
      <Spacer height={20} />
      <EmailButton text="Pay Now" href="#" />
    </Element>
    <EmailFooter />
  </Element>
);

// ─── Main EmailEditor Component ─────────────────────────────────────────────

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
  showSettingsPanel = true,
  className,
  style,
}) => {
  // Merge component registries
  const mergedComponents = useMemo<ComponentRegistry>(() => {
    if (replaceBuiltins) return userComponents || {};
    return { ...DEFAULT_COMPONENTS, ...(userComponents || {}) };
  }, [userComponents, replaceBuiltins]);

  // Build the Craft.js resolver from registry
  const resolver = useMemo(() => {
    const res = buildResolver(mergedComponents);
    res.Paper = Paper;
    return res;
  }, [mergedComponents]);

  const renderNodeFn = (slots.renderNode || RenderNode) as any;

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
        showSettingsPanel,
      }}
    >
      <div
        className={`h-screen flex flex-col bg-muted/30 ${className || ""}`}
        style={style}
      >
        <Editor resolver={resolver} onRender={renderNodeFn}>
          {showToolbar && <TopBar />}
          <div className="flex-1 flex overflow-hidden">
            {showToolbox && (
              <div className="w-72 border-r bg-background flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Components</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag components to canvas
                  </p>
                </div>
                <ScrollArea className="flex-1">
                  {slots.toolbox ? (
                    React.createElement(slots.toolbox, {
                      components: mergedComponents,
                      categories: Object.keys(mergedComponents).reduce<
                        string[]
                      >((acc, k) => {
                        const cat = mergedComponents[k].category || "Other";
                        if (!acc.includes(cat)) acc.push(cat);
                        return acc;
                      }, []),
                    })
                  ) : (
                    <Toolbox />
                  )}
                </ScrollArea>
              </div>
            )}

            <div
              className="flex-1 overflow-auto p-8 craftjs-renderer"
              style={{ backgroundColor: "#e5e5e5" }}
            >
              {initialState ? (
                <Frame data={initialState}>{defaultEmailContent}</Frame>
              ) : (
                <Frame>{defaultContent || defaultEmailContent}</Frame>
              )}
            </div>

            {showSettingsPanel && (
              <div className="w-80 border-l bg-background flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Properties</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Edit selected component
                  </p>
                </div>
                <SettingsPanel />
              </div>
            )}
          </div>
        </Editor>
      </div>
    </EditorProvider>
  );
};

export default EmailEditor;
