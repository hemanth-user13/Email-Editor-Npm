import React from 'react';
import { LucideIcon } from 'lucide-react';

// ─── Component Registry Types ───────────────────────────────────────────────

export interface EditorComponentConfig {
  /** The React component to render in the editor canvas */
  component: React.ComponentType<any>;
  /** Display name in the toolbox */
  label: string;
  /** Short description shown below the label */
  description?: string;
  /** Lucide icon or custom icon component */
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  /** Category grouping in the toolbox */
  category?: string;
  /** Default element to create when dragged (JSX element). If not provided, creates <Component /> */
  createElement?: () => React.ReactElement;
}

export type ComponentRegistry = Record<string, EditorComponentConfig>;

// ─── Theme Types ────────────────────────────────────────────────────────────

export interface EditorThemeColors {
  /** Primary accent color */
  primary?: string;
  /** Primary foreground (text on primary) */
  primaryForeground?: string;
  /** Background color of sidebars and panels */
  panelBackground?: string;
  /** Canvas/workspace background */
  canvasBackground?: string;
  /** Border color for panels and components */
  border?: string;
  /** Muted background for inactive elements */
  muted?: string;
  /** Text color for muted/secondary text */
  mutedForeground?: string;
  /** Destructive/delete action color */
  destructive?: string;
  /** Foreground/text color */
  foreground?: string;
  /** Background color */
  background?: string;
}

export interface EditorTheme {
  /** Custom color overrides */
  colors?: EditorThemeColors;
  /** Border radius for UI elements */
  borderRadius?: number;
  /** Font family for editor UI */
  fontFamily?: string;
  /** Paper/canvas width in pixels */
  paperWidth?: number;
  /** Paper minimum height in pixels */
  paperMinHeight?: number;
  /** Paper default background */
  paperBackground?: string;
}

// ─── Slot Override Types ────────────────────────────────────────────────────

export interface EditorSlots {
  /** Custom toolbar component (replaces the entire top bar) */
  toolbar?: React.ComponentType<ToolbarSlotProps>;
  /** Custom toolbox/sidebar component */
  toolbox?: React.ComponentType<ToolboxSlotProps>;
  /** Custom settings panel component */
  settingsPanel?: React.ComponentType<SettingsPanelSlotProps>;
  /** Custom empty state for settings panel when nothing is selected */
  settingsEmptyState?: React.ComponentType;
  /** Custom render node wrapper */
  renderNode?: React.ComponentType<{ render: React.ReactNode }>;
  /** Custom export dialog content */
  exportDialog?: React.ComponentType<ExportDialogSlotProps>;
  /** Custom preview dialog content */
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
  /** Unique template identifier */
  id: string;
  /** Display name */
  name: string;
  /** Template description */
  description?: string;
  /** Lucide icon */
  icon?: LucideIcon;
  /** Serialized Craft.js JSON state */
  data: string;
}

// ─── Event Callbacks ────────────────────────────────────────────────────────

export interface EditorCallbacks {
  /** Called when HTML is exported */
  onExport?: (html: string) => void;
  /** Called when the editor state changes */
  onChange?: (serializedState: string) => void;
  /** Called when a template is loaded */
  onTemplateLoad?: (templateId: string) => void;
  /** Called when canvas is cleared */
  onClear?: () => void;
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
  /** Additional components to register (merged with built-ins) */
  components?: ComponentRegistry;
  /** Replace ALL built-in components (use only your own) */
  replaceBuiltins?: boolean;
  /** Theme customization */
  theme?: EditorTheme;
  /** Slot overrides for UI sections */
  slots?: EditorSlots;
  /** Pre-defined templates */
  templates?: EmailTemplate[];
  /** Event callbacks */
  callbacks?: EditorCallbacks;
  /** Initial serialized state to load */
  initialState?: string;
  /** Default content to show (JSX children for the Frame) */
  defaultContent?: React.ReactNode;
  /** Editor title displayed in the toolbar */
  title?: string;
  /** Logo element for the toolbar */
  logo?: React.ReactNode;
  /** Custom HTML renderers for export (keyed by component resolved name) */
  htmlRenderers?: Record<string, HtmlRenderer>;
  /** Whether to show the toolbar */
  showToolbar?: boolean;
  /** Whether to show the left toolbox sidebar */
  showToolbox?: boolean;
  /** Whether to show the right settings panel */
  showSettingsPanel?: boolean;
  /** Custom class name for the editor root */
  className?: string;
  /** Custom inline styles for the editor root */
  style?: React.CSSProperties;
}
