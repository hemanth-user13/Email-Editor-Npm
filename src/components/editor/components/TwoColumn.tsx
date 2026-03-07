import React from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import { Container } from './Container';

interface TwoColumnProps {
  leftWidth?: number;
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const TwoColumn = ({
  leftWidth = 50,
  gap = 20,
  padding = 10,
  backgroundColor = '#ffffff',
}: TwoColumnProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        display: 'flex',
        gap: `${gap}px`,
        padding: `${padding}px`,
        backgroundColor,
        width: '100%',
      }}
    >
      <div style={{ width: `${leftWidth}%` }}>
        <Element id="left-column" is={Container} canvas background="#f9f9f9" padding={10}>
        </Element>
      </div>
      <div style={{ width: `${100 - leftWidth}%` }}>
        <Element id="right-column" is={Container} canvas background="#f9f9f9" padding={10}>
        </Element>
      </div>
    </div>
  );
};

const TwoColumnSettings = () => {
  const { actions: { setProp }, leftWidth, gap, padding, backgroundColor } = useNode((node) => ({
    leftWidth: node.data.props.leftWidth,
    gap: node.data.props.gap,
    padding: node.data.props.padding,
    backgroundColor: node.data.props.backgroundColor,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Left Column Width</label>
        <input
          type="range"
          min={20}
          max={80}
          value={leftWidth || 50}
          onChange={(e) => setProp((props: TwoColumnProps) => (props.leftWidth = parseInt(e.target.value)))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Left: {leftWidth}%</span>
          <span>Right: {100 - (leftWidth || 50)}%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gap</label>
        <input
          type="range"
          min={0}
          max={40}
          value={gap || 20}
          onChange={(e) => setProp((props: TwoColumnProps) => (props.gap = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{gap}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={40}
          value={padding || 10}
          onChange={(e) => setProp((props: TwoColumnProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#ffffff'}
          onChange={(e) => setProp((props: TwoColumnProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
    </div>
  );
};

TwoColumn.craft = {
  props: {
    leftWidth: 50,
    gap: 20,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  related: {
    settings: TwoColumnSettings,
  },
};
