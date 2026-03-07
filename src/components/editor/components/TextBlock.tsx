import React from 'react';
import { useNode } from '@craftjs/core';

interface TextBlockProps {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  padding?: number;
  lineHeight?: number;
}

export const TextBlock = ({
  text = 'Enter your text here...',
  fontSize = 14,
  fontWeight = 'normal',
  color = '#333333',
  align = 'left',
  padding = 10,
  lineHeight = 1.6,
}: TextBlockProps) => {
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
      >
        {text}
      </p>
    </div>
  );
};

const TextBlockSettings = () => {
  const { actions: { setProp }, text, fontSize, fontWeight, color, align, padding, lineHeight } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
    align: node.data.props.align,
    padding: node.data.props.padding,
    lineHeight: node.data.props.lineHeight,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Text Content</label>
        <textarea
          value={text || ''}
          onChange={(e) => setProp((props: TextBlockProps) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input
          type="range"
          min={10}
          max={32}
          value={fontSize || 14}
          onChange={(e) => setProp((props: TextBlockProps) => (props.fontSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{fontSize}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font Weight</label>
        <select
          value={fontWeight || 'normal'}
          onChange={(e) => setProp((props: TextBlockProps) => (props.fontWeight = e.target.value as 'normal' | 'bold'))}
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
          onChange={(e) => setProp((props: TextBlockProps) => (props.color = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={align || 'left'}
          onChange={(e) => setProp((props: TextBlockProps) => (props.align = e.target.value as 'left' | 'center' | 'right'))}
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
          onChange={(e) => setProp((props: TextBlockProps) => (props.padding = parseInt(e.target.value)))}
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
          onChange={(e) => setProp((props: TextBlockProps) => (props.lineHeight = parseFloat(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{lineHeight}</span>
      </div>
    </div>
  );
};

TextBlock.craft = {
  props: {
    text: 'Enter your text here...',
    fontSize: 14,
    fontWeight: 'normal',
    color: '#333333',
    align: 'left',
    padding: 10,
    lineHeight: 1.6,
  },
  related: {
    settings: TextBlockSettings,
  },
};
