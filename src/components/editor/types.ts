import React from 'react';
import { LucideIcon } from 'lucide-react';

// ─── Component Registry Types ───────────────────────────────────────────────

export interface EditorComponentConfig {
  component: React.ComponentType<any>;
  label: string;
  description?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  category?: string;
  createElement?: () => React.ReactElement;
}

export type ComponentRegistry = Record<string, EditorComponentConfig>;

// ─── Theme Types ────────────────────────────────────────────────────────────

export interface EditorThemeColors {
  primary?: string;
  primaryForeground?: string;
  panelBackground?: string;
  canvasBackground?: string;
  border?: string;
  muted?: string;
  mutedForeground?: string;
  destructive?: string;
  foreground?: string;
  background?: string;
}

export interface EditorTheme {
  colors?: EditorThemeColors;
  borderRadius?: number;
  fontFamily?: string;
  paperWidth?: number;
  paperMinHeight?: number;
  paperBackground?: string;
}

// ─── Slot Override Types ────────────────────────────────────────────────────

export interface EditorSlots {
  toolbar?: React.ComponentType<ToolbarSlotProps>;
  toolbox?: React.ComponentType<ToolboxSlotProps>;
  settingsPanel?: React.ComponentType<SettingsPanelSlotProps>;
  settingsEmptyState?: React.ComponentType;
  renderNode?: React.ComponentType<{ render: React.ReactNode }>;
  exportDialog?: React.ComponentType<ExportDialogSlotProps>;
  previewDialog?: React.ComponentType<PreviewDialogSlotProps>;
}

export interface ToolbarSlotProps {
  onExport: () => string;
  onPreview: () => string;
  onClear: () => void;
  title?: string;
  logo?: React.ReactNode;
}

export interface ToolboxSlotProps {
  components: ComponentRegistry;
  categories: string[];
}

export interface SettingsPanelSlotProps {
  selectedId?: string;
  selectedName?: string;
  selectedSettings?: React.ComponentType;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export interface ExportDialogSlotProps {
  html: string;
  onClose: () => void;
}

export interface PreviewDialogSlotProps {
  html: string;
  onClose: () => void;
}

// ─── Template Types ─────────────────────────────────────────────────────────

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  icon?: LucideIcon;
  data: string;
}

// ─── Event Callbacks ────────────────────────────────────────────────────────

export interface EditorCallbacks {
  onExport?: (html: string) => void;
  onChange?: (serializedState: string) => void;
  onTemplateLoad?: (templateId: string) => void;
  onClear?: () => void;
  /** Called when theme color changes via the built-in color picker */
  onColorChange?: (primaryHsl: string) => void;
}

// ─── HTML Exporter Types ────────────────────────────────────────────────────

export type HtmlRenderer = (
  typeName: string,
  props: Record<string, unknown>,
  childrenHtml: string,
  linkedNodes?: Record<string, string>
) => string | null;

// ─── Main Editor Props ──────────────────────────────────────────────────────

export interface EmailEditorProps {
  components?: ComponentRegistry;
  replaceBuiltins?: boolean;
  theme?: EditorTheme;
  slots?: EditorSlots;
  templates?: EmailTemplate[];
  callbacks?: EditorCallbacks;
  initialState?: string;
  defaultContent?: React.ReactNode;
  title?: string;
  logo?: React.ReactNode;
  htmlRenderers?: Record<string, HtmlRenderer>;
  showToolbar?: boolean;
  showToolbox?: boolean;
  /** Enable dark mode (applies `dark` class to editor root). Default: true */
  darkMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
