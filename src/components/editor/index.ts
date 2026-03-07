// ─── Main Editor Component ──────────────────────────────────────────────────
export { EmailEditor } from './EmailEditor';

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
} from './types';

// ─── Context & Hooks ────────────────────────────────────────────────────────
export { useEditorConfig, EditorProvider } from './context';

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
} from './components';

// ─── Default Registry ───────────────────────────────────────────────────────
export { DEFAULT_COMPONENTS, buildResolver, getCategories } from './defaultComponents';

// ─── Utilities ──────────────────────────────────────────────────────────────
export { generateEmailHtml } from '../../lib/htmlExporter';

// ─── Internal UI (for advanced customization) ───────────────────────────────
export { Paper } from './Paper';
export { Toolbox } from './Toolbox';
export { SettingsPanel } from './SettingsPanel';
export { RenderNode } from './RenderNode';
