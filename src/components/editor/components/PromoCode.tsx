import React from 'react';
import { useNode } from '@craftjs/core';

interface PromoCodeProps {
  title?: string;
  code?: string;
  description?: string;
  backgroundColor?: string;
  borderColor?: string;
  codeBackground?: string;
  textColor?: string;
  codeColor?: string;
  padding?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
}

export const PromoCode = ({
  title = '🎉 Special Offer!',
  code = 'SAVE20',
  description = 'Use this code at checkout to get 20% off your order',
  backgroundColor = '#fff8e1',
  borderColor = '#ffc107',
  codeBackground = '#ffffff',
  textColor = '#333333',
  codeColor = '#e65100',
  padding = 24,
  borderStyle = 'dashed',
}: PromoCodeProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        backgroundColor,
        border: `2px ${borderStyle} ${borderColor}`,
        borderRadius: '8px',
        padding: `${padding}px`,
        textAlign: 'center',
        margin: '10px',
      }}
    >
      {title && (
        <div
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: textColor,
            marginBottom: '12px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {title}
        </div>
      )}
      
      <div
        style={{
          display: 'inline-block',
          backgroundColor: codeBackground,
          border: `1px solid ${borderColor}`,
          borderRadius: '6px',
          padding: '12px 24px',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: '3px',
            color: codeColor,
          }}
        >
          {code}
        </span>
      </div>

      {description && (
        <div
          style={{
            fontSize: '14px',
            color: textColor,
            fontFamily: 'Arial, sans-serif',
            opacity: 0.8,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

const PromoCodeSettings = () => {
  const {
    actions: { setProp },
    title,
    code,
    description,
    backgroundColor,
    borderColor,
    codeBackground,
    textColor,
    codeColor,
    padding,
    borderStyle,
  } = useNode((node) => ({
    title: node.data.props.title,
    code: node.data.props.code,
    description: node.data.props.description,
    backgroundColor: node.data.props.backgroundColor,
    borderColor: node.data.props.borderColor,
    codeBackground: node.data.props.codeBackground,
    textColor: node.data.props.textColor,
    codeColor: node.data.props.codeColor,
    padding: node.data.props.padding,
    borderStyle: node.data.props.borderStyle,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title || ''}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Promo Code</label>
        <input
          type="text"
          value={code || ''}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.code = e.target.value.toUpperCase()))}
          className="w-full px-3 py-2 border rounded-md text-sm font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description || ''}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.description = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm min-h-[60px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Border Style</label>
        <select
          value={borderStyle || 'dashed'}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.borderStyle = e.target.value as 'solid' | 'dashed' | 'dotted'))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#fff8e1'}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Border Color</label>
        <input
          type="color"
          value={borderColor || '#ffc107'}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.borderColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Code Color</label>
        <input
          type="color"
          value={codeColor || '#e65100'}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.codeColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={12}
          max={48}
          value={padding || 24}
          onChange={(e) => setProp((props: PromoCodeProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

PromoCode.craft = {
  props: {
    title: '🎉 Special Offer!',
    code: 'SAVE20',
    description: 'Use this code at checkout to get 20% off your order',
    backgroundColor: '#fff8e1',
    borderColor: '#ffc107',
    codeBackground: '#ffffff',
    textColor: '#333333',
    codeColor: '#e65100',
    padding: 24,
    borderStyle: 'dashed',
  },
  related: {
    settings: PromoCodeSettings,
  },
};
