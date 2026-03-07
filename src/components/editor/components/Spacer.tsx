import React from 'react';
import { useNode } from '@craftjs/core';

interface SpacerProps {
  height?: number;
}

export const Spacer = ({ height = 20 }: SpacerProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        height: `${height}px`,
        width: '100%',
        backgroundColor: 'transparent',
      }}
    />
  );
};

const SpacerSettings = () => {
  const { actions: { setProp }, height } = useNode((node) => ({
    height: node.data.props.height,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Height</label>
        <input
          type="range"
          min={5}
          max={100}
          value={height || 20}
          onChange={(e) => setProp((props: SpacerProps) => (props.height = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{height}px</span>
      </div>
    </div>
  );
};

Spacer.craft = {
  props: {
    height: 20,
  },
  related: {
    settings: SpacerSettings,
  },
};
