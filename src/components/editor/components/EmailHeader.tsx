import React from 'react';
import { useNode } from '@craftjs/core';

interface EmailHeaderProps {
  logoUrl?: string;
  companyName?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
}

export const EmailHeader = ({
  logoUrl = '',
  companyName = 'Your Company',
  backgroundColor = '#1a1a2e',
  textColor = '#ffffff',
  padding = 24,
}: EmailHeaderProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        textAlign: 'center',
      }}
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt="Logo"
          style={{ maxHeight: '60px', marginBottom: '12px' }}
        />
      )}
      <h1
        style={{
          color: textColor,
          fontSize: '24px',
          fontWeight: 'bold',
          margin: 0,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {companyName}
      </h1>
    </div>
  );
};

const EmailHeaderSettings = () => {
  const { actions: { setProp }, logoUrl, companyName, backgroundColor, textColor, padding } = useNode((node) => ({
    logoUrl: node.data.props.logoUrl,
    companyName: node.data.props.companyName,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    padding: node.data.props.padding,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          value={companyName || ''}
          onChange={(e) => setProp((props: EmailHeaderProps) => (props.companyName = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Logo URL</label>
        <input
          type="text"
          value={logoUrl || ''}
          onChange={(e) => setProp((props: EmailHeaderProps) => (props.logoUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="https://example.com/logo.png"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#1a1a2e'}
          onChange={(e) => setProp((props: EmailHeaderProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={textColor || '#ffffff'}
          onChange={(e) => setProp((props: EmailHeaderProps) => (props.textColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={60}
          value={padding || 24}
          onChange={(e) => setProp((props: EmailHeaderProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

EmailHeader.craft = {
  props: {
    logoUrl: '',
    companyName: 'Your Company',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    padding: 24,
  },
  related: {
    settings: EmailHeaderSettings,
  },
};
