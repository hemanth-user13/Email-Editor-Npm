import React from 'react';
import { useNode } from '@craftjs/core';

interface ImageBlockProps {
  src?: string;
  alt?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  padding?: number;
  borderRadius?: number;
}

export const ImageBlock = ({
  src = 'https://via.placeholder.com/400x200',
  alt = 'Image',
  width = '100%',
  align = 'center',
  padding = 10,
  borderRadius = 0,
}: ImageBlockProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        textAlign: align,
        padding: `${padding}px`,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width,
          maxWidth: '100%',
          borderRadius: `${borderRadius}px`,
          display: 'inline-block',
        }}
      />
    </div>
  );
};

const ImageBlockSettings = () => {
  const { actions: { setProp }, src, alt, width, align, padding, borderRadius } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    align: node.data.props.align,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          value={src || ''}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.src = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="https://example.com/image.png"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alt Text</label>
        <input
          type="text"
          value={alt || ''}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.alt = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <input
          type="text"
          value={width || '100%'}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.width = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="100% or 300px"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={align || 'center'}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.align = e.target.value as 'left' | 'center' | 'right'))}
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
          onChange={(e) => setProp((props: ImageBlockProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Border Radius</label>
        <input
          type="range"
          min={0}
          max={30}
          value={borderRadius || 0}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.borderRadius = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{borderRadius}px</span>
      </div>
    </div>
  );
};

ImageBlock.craft = {
  props: {
    src: 'https://via.placeholder.com/400x200',
    alt: 'Image',
    width: '100%',
    align: 'center',
    padding: 10,
    borderRadius: 0,
  },
  related: {
    settings: ImageBlockSettings,
  },
};
