import React from 'react';
import { useNode } from '@craftjs/core';

interface EmailButtonProps {
  text?: string;
  href?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  paddingX?: number;
  paddingY?: number;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
}

export const EmailButton = ({
  text = 'Click Here',
  href = '#',
  backgroundColor = '#0066cc',
  textColor = '#ffffff',
  borderRadius = 6,
  paddingX = 24,
  paddingY = 12,
  fontSize = 16,
  align = 'center',
}: EmailButtonProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        textAlign: align,
        padding: '10px 0',
      }}
    >
      <a
        href={href}
        style={{
          display: 'inline-block',
          backgroundColor,
          color: textColor,
          padding: `${paddingY}px ${paddingX}px`,
          borderRadius: `${borderRadius}px`,
          textDecoration: 'none',
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {text}
      </a>
    </div>
  );
};

const EmailButtonSettings = () => {
  const { actions: { setProp }, text, href, backgroundColor, textColor, borderRadius, paddingX, paddingY, fontSize, align } = useNode((node) => ({
    text: node.data.props.text,
    href: node.data.props.href,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    borderRadius: node.data.props.borderRadius,
    paddingX: node.data.props.paddingX,
    paddingY: node.data.props.paddingY,
    fontSize: node.data.props.fontSize,
    align: node.data.props.align,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={text || ''}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Link URL</label>
        <input
          type="text"
          value={href || ''}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.href = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={align || 'center'}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.align = e.target.value as 'left' | 'center' | 'right'))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#0066cc'}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={textColor || '#ffffff'}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.textColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Border Radius</label>
        <input
          type="range"
          min={0}
          max={30}
          value={borderRadius || 6}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.borderRadius = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{borderRadius}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input
          type="range"
          min={12}
          max={24}
          value={fontSize || 16}
          onChange={(e) => setProp((props: EmailButtonProps) => (props.fontSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{fontSize}px</span>
      </div>
    </div>
  );
};

EmailButton.craft = {
  props: {
    text: 'Click Here',
    href: '#',
    backgroundColor: '#0066cc',
    textColor: '#ffffff',
    borderRadius: 6,
    paddingX: 24,
    paddingY: 12,
    fontSize: 16,
    align: 'center',
  },
  related: {
    settings: EmailButtonSettings,
  },
};
