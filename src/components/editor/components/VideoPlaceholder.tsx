import React from 'react';
import { useNode } from '@craftjs/core';

interface VideoPlaceholderProps {
  thumbnailUrl?: string;
  videoUrl?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  padding?: number;
  borderRadius?: number;
  playButtonColor?: string;
  overlayOpacity?: number;
}

export const VideoPlaceholder = ({
  thumbnailUrl = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=338&fit=crop',
  videoUrl = '#',
  width = '100%',
  align = 'center',
  padding = 10,
  borderRadius = 8,
  playButtonColor = '#ffffff',
  overlayOpacity = 0.3,
}: VideoPlaceholderProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        textAlign: align,
        padding: `${padding}px`,
      }}
    >
      <a
        href={videoUrl}
        style={{
          display: 'inline-block',
          position: 'relative',
          width,
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
          }}
        >
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            style={{
              width: '100%',
              display: 'block',
            }}
          />
          
          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Play Button */}
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${playButtonColor}`,
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  borderLeft: `20px solid ${playButtonColor}`,
                  marginLeft: '4px',
                }}
              />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

const VideoPlaceholderSettings = () => {
  const {
    actions: { setProp },
    thumbnailUrl,
    videoUrl,
    width,
    align,
    padding,
    borderRadius,
    playButtonColor,
    overlayOpacity,
  } = useNode((node) => ({
    thumbnailUrl: node.data.props.thumbnailUrl,
    videoUrl: node.data.props.videoUrl,
    width: node.data.props.width,
    align: node.data.props.align,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    playButtonColor: node.data.props.playButtonColor,
    overlayOpacity: node.data.props.overlayOpacity,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
        <input
          type="text"
          value={thumbnailUrl || ''}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.thumbnailUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Video URL</label>
        <input
          type="text"
          value={videoUrl || ''}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.videoUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Width</label>
        <input
          type="text"
          value={width || '100%'}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.width = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="100% or 400px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={align || 'center'}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.align = e.target.value as 'left' | 'center' | 'right'))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Play Button Color</label>
        <input
          type="color"
          value={playButtonColor || '#ffffff'}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.playButtonColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Overlay Opacity</label>
        <input
          type="range"
          min={0}
          max={0.8}
          step={0.1}
          value={overlayOpacity || 0.3}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.overlayOpacity = parseFloat(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{(overlayOpacity || 0.3).toFixed(1)}</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Border Radius</label>
        <input
          type="range"
          min={0}
          max={24}
          value={borderRadius || 8}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.borderRadius = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{borderRadius}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={40}
          value={padding || 10}
          onChange={(e) => setProp((props: VideoPlaceholderProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

VideoPlaceholder.craft = {
  props: {
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=338&fit=crop',
    videoUrl: '#',
    width: '100%',
    align: 'center',
    padding: 10,
    borderRadius: 8,
    playButtonColor: '#ffffff',
    overlayOpacity: 0.3,
  },
  related: {
    settings: VideoPlaceholderSettings,
  },
};
