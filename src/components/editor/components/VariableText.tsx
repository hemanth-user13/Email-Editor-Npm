import React from 'react';
import { useNode } from '@craftjs/core';

interface VariableTextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  padding?: number;
  lineHeight?: number;
}

const AVAILABLE_VARIABLES = [
  { key: '{{first_name}}', label: 'First Name', preview: 'John' },
  { key: '{{last_name}}', label: 'Last Name', preview: 'Doe' },
  { key: '{{full_name}}', label: 'Full Name', preview: 'John Doe' },
  { key: '{{email}}', label: 'Email', preview: 'john@example.com' },
  { key: '{{company}}', label: 'Company', preview: 'Acme Inc' },
  { key: '{{invoice_number}}', label: 'Invoice #', preview: 'INV-001' },
  { key: '{{invoice_date}}', label: 'Invoice Date', preview: '2024-01-15' },
  { key: '{{due_date}}', label: 'Due Date', preview: '2024-01-30' },
  { key: '{{total_amount}}', label: 'Total Amount', preview: '$1,500.00' },
  { key: '{{order_number}}', label: 'Order #', preview: 'ORD-12345' },
];

const renderWithVariables = (text: string) => {
  let rendered = text;
  AVAILABLE_VARIABLES.forEach(({ key, preview }) => {
    rendered = rendered.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), 
      `<span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;">${preview}</span>`
    );
  });
  return rendered;
};

export const VariableText = ({
  text = 'Hello {{first_name}}, thank you for your order {{order_number}}!',
  fontSize = 14,
  fontWeight = 'normal',
  color = '#333333',
  align = 'left',
  padding = 10,
  lineHeight = 1.6,
}: VariableTextProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        padding: `${padding}px`,
      }}
    >
      <p
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          textAlign: align,
          lineHeight,
          margin: 0,
          fontFamily: 'Arial, sans-serif',
        }}
        dangerouslySetInnerHTML={{ __html: renderWithVariables(text) }}
      />
    </div>
  );
};

const VariableTextSettings = () => {
  const { actions: { setProp }, text, fontSize, fontWeight, color, align, padding, lineHeight } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
    align: node.data.props.align,
    padding: node.data.props.padding,
    lineHeight: node.data.props.lineHeight,
  }));

  const insertVariable = (variable: string) => {
    setProp((props: VariableTextProps) => {
      props.text = (props.text || '') + variable;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Text Content</label>
        <textarea
          value={text || ''}
          onChange={(e) => setProp((props: VariableTextProps) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px] font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Insert Variable</label>
        <div className="flex flex-wrap gap-1">
          {AVAILABLE_VARIABLES.map((v) => (
            <button
              key={v.key}
              onClick={() => insertVariable(v.key)}
              className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded border border-primary/20 transition-colors"
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input
          type="range"
          min={10}
          max={32}
          value={fontSize || 14}
          onChange={(e) => setProp((props: VariableTextProps) => (props.fontSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{fontSize}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Font Weight</label>
        <select
          value={fontWeight || 'normal'}
          onChange={(e) => setProp((props: VariableTextProps) => (props.fontWeight = e.target.value as 'normal' | 'bold'))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={color || '#333333'}
          onChange={(e) => setProp((props: VariableTextProps) => (props.color = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={align || 'left'}
          onChange={(e) => setProp((props: VariableTextProps) => (props.align = e.target.value as 'left' | 'center' | 'right'))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={40}
          value={padding || 10}
          onChange={(e) => setProp((props: VariableTextProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Line Height</label>
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.1}
          value={lineHeight || 1.6}
          onChange={(e) => setProp((props: VariableTextProps) => (props.lineHeight = parseFloat(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{lineHeight}</span>
      </div>
    </div>
  );
};

VariableText.craft = {
  props: {
    text: 'Hello {{first_name}}, thank you for your order {{order_number}}!',
    fontSize: 14,
    fontWeight: 'normal',
    color: '#333333',
    align: 'left',
    padding: 10,
    lineHeight: 1.6,
  },
  related: {
    settings: VariableTextSettings,
  },
};

export { AVAILABLE_VARIABLES };
