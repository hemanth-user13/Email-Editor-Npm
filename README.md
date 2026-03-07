# React Email Editor

A professional, fully customizable drag-and-drop email template editor built with React, Craft.js, Tailwind CSS, and shadcn/ui.

![Editor UI](src/assets/Screenshot%202026-03-07%20173128.png)
![Editor UI](src/assets/Screenshot%202026-03-07%20173216.png)

## Features

- 🎨 **Dark mode** by default with `dark:` class support
- 🧩 **16+ built-in components** — Header, Footer, Text, Image, Button, Invoice Table, Countdown, Promo Code, Testimonial, and more
- 🔌 **Props-based component registry** — add custom blocks via props
- 🎛️ **Full slot system** — override toolbar, toolbox, settings panel, export/preview dialogs
- 🎨 **Built-in color customizer** — users can change the primary color at runtime
- 📱 **Responsive preview** — desktop and mobile preview modes
- 📤 **HTML export** — generates email-client-compatible HTML with table-based layouts
- 🏗️ **Single sidebar layout** — components + properties in one left panel via tabs

## Installation

```bash
# Copy the src/components/editor directory into your project
cp -r src/components/editor your-project/src/components/editor
cp src/lib/htmlExporter.ts your-project/src/lib/htmlExporter.ts
```

### Peer Dependencies

Ensure your project has these installed:

```bash
npm install @craftjs/core react react-dom lucide-react tailwindcss tailwind-merge clsx class-variance-authority
```

Also requires [shadcn/ui](https://ui.shadcn.com/) components: `button`, `scroll-area`, `tabs`, `accordion`, `dialog`, `dropdown-menu`, `popover`, `label`, `separator`.

### Tailwind Config

Make sure your `tailwind.config.ts` has `darkMode: ["class"]` and includes the editor path in `content`:

```ts
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    // Include the editor component path
  ],
  // ...
};
```

## Usage

### Basic

```tsx
import { EmailEditor } from "@/components/editor";

function App() {
  return <EmailEditor />;
}
```

### With Custom Components

```tsx
import { EmailEditor } from "@/components/editor";
import { MyCustomBlock } from "./MyCustomBlock";
import { Puzzle } from "lucide-react";

function App() {
  return (
    <EmailEditor
      components={{
        MyCustomBlock: {
          component: MyCustomBlock,
          label: "Custom Block",
          description: "A custom email block",
          icon: Puzzle,
          category: "Custom",
        },
      }}
    />
  );
}
```

### Full Customization

```tsx
import { EmailEditor } from "@/components/editor";

function App() {
  return (
    <EmailEditor
      title="Invoice Builder"
      darkMode={true}
      theme={{
        paperWidth: 600,
        paperMinHeight: 800,
        paperBackground: "#ffffff",
      }}
      callbacks={{
        onExport: (html) => console.log("Exported:", html),
        onChange: (state) => localStorage.setItem("draft", state),
        onColorChange: (hsl) => console.log("Primary color:", hsl),
      }}
      templates={[
        {
          id: "welcome",
          name: "Welcome Email",
          description: "Onboarding template",
          data: "{ ... }", // Serialized Craft.js JSON
        },
      ]}
      htmlRenderers={{
        MyCustomBlock: (name, props, children) => {
          return `<td style="padding:20px">${children}</td>`;
        },
      }}
    />
  );
}
```

### Props API

| Prop              | Type                           | Default          | Description                                        |
| ----------------- | ------------------------------ | ---------------- | -------------------------------------------------- |
| `components`      | `ComponentRegistry`            | `{}`             | Additional components merged with built-ins        |
| `replaceBuiltins` | `boolean`                      | `false`          | Replace all built-in components                    |
| `theme`           | `EditorTheme`                  | `{}`             | Paper width, height, background                    |
| `slots`           | `EditorSlots`                  | `{}`             | Override toolbar, toolbox, settings panel, dialogs |
| `templates`       | `EmailTemplate[]`              | `[]`             | Pre-defined templates                              |
| `callbacks`       | `EditorCallbacks`              | `{}`             | Event handlers (onExport, onChange, etc.)          |
| `initialState`    | `string`                       | —                | Serialized Craft.js state to restore               |
| `defaultContent`  | `ReactNode`                    | —                | Default JSX content for the canvas                 |
| `title`           | `string`                       | `'Email Editor'` | Toolbar title                                      |
| `logo`            | `ReactNode`                    | —                | Custom logo element                                |
| `htmlRenderers`   | `Record<string, HtmlRenderer>` | `{}`             | Custom HTML renderers for export                   |
| `showToolbar`     | `boolean`                      | `true`           | Show/hide top toolbar                              |
| `showToolbox`     | `boolean`                      | `true`           | Show/hide left sidebar                             |
| `darkMode`        | `boolean`                      | `true`           | Enable dark mode                                   |
| `className`       | `string`                       | —                | Additional CSS class                               |
| `style`           | `CSSProperties`                | —                | Inline styles                                      |

### Slot Overrides

Override any UI section with your own component:

```tsx
<EmailEditor
  slots={{
    toolbar: MyToolbar, // Full toolbar replacement
    toolbox: MyToolbox, // Component list replacement
    settingsPanel: MySettings, // Properties panel replacement
    exportDialog: MyExport, // Export dialog content
    previewDialog: MyPreview, // Preview dialog content
    renderNode: MyNodeWrapper, // Custom node wrapper
  }}
/>
```

### Creating Custom Components

Custom components need a `craft` static property for Craft.js:

```tsx
import { useNode } from "@craftjs/core";

const MyBlock = ({ text = "Hello" }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref!))}>
      <p>{text}</p>
    </div>
  );
};

const MyBlockSettings = () => {
  const {
    actions: { setProp },
    text,
  } = useNode((node) => ({
    text: node.data.props.text,
  }));
  return (
    <input
      value={text}
      onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
    />
  );
};

MyBlock.craft = {
  props: { text: "Hello" },
  related: { settings: MyBlockSettings },
};
```

## Architecture

```
src/components/editor/
├── EmailEditor.tsx        # Main entry point with layout + toolbar
├── types.ts               # All TypeScript interfaces
├── context.tsx            # React context for editor config
├── defaultComponents.tsx  # Built-in component registry
├── Paper.tsx              # Canvas wrapper component
├── Toolbox.tsx            # Component palette (left sidebar)
├── SettingsPanel.tsx      # Properties editor (left sidebar tab)
├── RenderNode.tsx         # Node selection overlay
├── components/            # All built-in email components
│   ├── Container.tsx
│   ├── EmailHeader.tsx
│   ├── EmailFooter.tsx
│   ├── TextBlock.tsx
│   ├── ImageBlock.tsx
│   ├── EmailButton.tsx
│   ├── Divider.tsx
│   ├── Spacer.tsx
│   ├── TwoColumn.tsx
│   ├── InvoiceTable.tsx
│   ├── SocialLinks.tsx
│   ├── Countdown.tsx
│   ├── PromoCode.tsx
│   ├── Testimonial.tsx
│   ├── VideoPlaceholder.tsx
│   ├── VariableText.tsx
│   ├── IconList.tsx
│   └── index.ts
└── index.ts               # Public barrel export
```

## License

MIT
