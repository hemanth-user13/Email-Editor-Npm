// ─── Main Editor Component ──────────────────────────────────────────────────
export { EmailEditor } from '../src/components/editor/EmailEditor';

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
  EmailEditorProps,
  EditorComponentConfig,
  ComponentRegistry,
  EditorTheme,
  EditorThemeColors,
  EditorSlots,
  EditorCallbacks,
  EmailTemplate,
  HtmlRenderer,
  ToolbarSlotProps,
  ToolboxSlotProps,
  SettingsPanelSlotProps,
  ExportDialogSlotProps,
  PreviewDialogSlotProps,
} from '../src/components/editor/types';

// ─── Context & Hooks ────────────────────────────────────────────────────────
export { useEditorConfig, EditorProvider } from '../src/components/editor/context';

// ─── Built-in Components ────────────────────────────────────────────────────
export {
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
  AVAILABLE_VARIABLES,
  IconList,
} from '../src/components/editor/components';

// ─── Default Registry ───────────────────────────────────────────────────────
export { DEFAULT_COMPONENTS, buildResolver, getCategories } from './components/editor/defaultComponents';

// ─── Utilities ──────────────────────────────────────────────────────────────
export { generateEmailHtml } from './lib/htmlExporter';

// ─── Internal UI (for advanced customization) ───────────────────────────────
export { Paper } from "./components/editor"
export { Toolbox } from './components/editor';
export { SettingsPanel } from './components/editor';
export { RenderNode } from './components/editor';
