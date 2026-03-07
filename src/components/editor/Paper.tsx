import React from 'react';
import { useNode } from '@craftjs/core';
import { useEditorConfig } from './context';

interface PaperProps {
  children?: React.ReactNode;
  background?: string;
}

export const Paper = ({ children, background }: PaperProps) => {
  const { connectors: { connect } } = useNode();
  const { theme } = useEditorConfig();

  const bg = background || theme.paperBackground || '#ffffff';

  return (
    <div
      ref={(ref) => connect(ref!)}
      style={{
        width: `${theme.paperWidth || 600}px`,
        minHeight: `${theme.paperMinHeight || 800}px`,
        margin: '0 auto',
        backgroundColor: bg,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

const PaperSettings = () => {
  const { actions: { setProp }, background } = useNode((node) => ({
    background: node.data.props.background,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email Background</label>
        <input
          type="color"
          value={background || '#ffffff'}
          onChange={(e) => setProp((props: PaperProps) => (props.background = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
    </div>
  );
};

Paper.craft = {
  props: {
    background: '#ffffff',
  },
  related: {
    settings: PaperSettings,
  },
};
