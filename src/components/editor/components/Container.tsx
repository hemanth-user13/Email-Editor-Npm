import React from 'react';
import { useNode } from '@craftjs/core';

interface ContainerProps {
  background?: string;
  padding?: number;
  children?: React.ReactNode;
}

export const Container = ({ background = '#ffffff', padding = 20, children }: ContainerProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        background,
        padding: `${padding}px`,
        minHeight: '50px',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

const ContainerSettings = () => {
  const { actions: { setProp }, background, padding } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={background || '#ffffff'}
          onChange={(e) => setProp((props: ContainerProps) => (props.background = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={60}
          value={padding || 20}
          onChange={(e) => setProp((props: ContainerProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

Container.craft = {
  props: {
    background: '#ffffff',
    padding: 20,
  },
  related: {
    settings: ContainerSettings,
  },
};
