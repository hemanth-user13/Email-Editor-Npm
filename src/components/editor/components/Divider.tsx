import React from 'react';
import { useNode } from '@craftjs/core';

interface DividerProps {
  color?: string;
  thickness?: number;
  margin?: number;
  width?: string;
}

export const Divider = ({
  color = '#e0e0e0',
  thickness = 1,
  margin = 20,
  width = '100%',
}: DividerProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        padding: `${margin}px 0`,
        textAlign: 'center',
      }}
    >
      <hr
        style={{
          border: 'none',
          borderTop: `${thickness}px solid ${color}`,
          width,
          margin: '0 auto',
        }}
      />
    </div>
  );
};

const DividerSettings = () => {
  const { actions: { setProp }, color, thickness, margin, width } = useNode((node) => ({
    color: node.data.props.color,
    thickness: node.data.props.thickness,
    margin: node.data.props.margin,
    width: node.data.props.width,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <input
          type="color"
          value={color || '#e0e0e0'}
          onChange={(e) => setProp((props: DividerProps) => (props.color = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Thickness</label>
        <input
          type="range"
          min={1}
          max={10}
          value={thickness || 1}
          onChange={(e) => setProp((props: DividerProps) => (props.thickness = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{thickness}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Margin (Top/Bottom)</label>
        <input
          type="range"
          min={0}
          max={40}
          value={margin || 20}
          onChange={(e) => setProp((props: DividerProps) => (props.margin = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{margin}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <input
          type="text"
          value={width || '100%'}
          onChange={(e) => setProp((props: DividerProps) => (props.width = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="100% or 80%"
        />
      </div>
    </div>
  );
};

Divider.craft = {
  props: {
    color: '#e0e0e0',
    thickness: 1,
    margin: 20,
    width: '100%',
  },
  related: {
    settings: DividerSettings,
  },
};
