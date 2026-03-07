import React from 'react';
import { useNode } from '@craftjs/core';

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
  url: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  align?: 'left' | 'center' | 'right';
  padding?: number;
  gap?: number;
}

const socialIcons: Record<string, string> = {
  facebook: 'https://cdn-icons-png.flaticon.com/128/733/733547.png',
  twitter: 'https://cdn-icons-png.flaticon.com/128/733/733579.png',
  instagram: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png',
  linkedin: 'https://cdn-icons-png.flaticon.com/128/3536/3536505.png',
  youtube: 'https://cdn-icons-png.flaticon.com/128/1384/1384060.png',
  tiktok: 'https://cdn-icons-png.flaticon.com/128/3046/3046121.png',
};

export const SocialLinks = ({
  links = [
    { platform: 'facebook', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'linkedin', url: '#' },
  ],
  iconSize = 32,
  iconColor = '#333333',
  backgroundColor = 'transparent',
  align = 'center',
  padding = 16,
  gap = 16,
}: SocialLinksProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        textAlign: align,
        padding: `${padding}px`,
        backgroundColor,
      }}
    >
      <div style={{ display: 'inline-flex', gap: `${gap}px` }}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            style={{
              display: 'inline-block',
              width: iconSize,
              height: iconSize,
            }}
          >
            <img
              src={socialIcons[link.platform]}
              alt={link.platform}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

const SocialLinksSettings = () => {
  const { actions: { setProp }, links, iconSize, align, padding, gap, backgroundColor } = useNode((node) => ({
    links: node.data.props.links,
    iconSize: node.data.props.iconSize,
    align: node.data.props.align,
    padding: node.data.props.padding,
    gap: node.data.props.gap,
    backgroundColor: node.data.props.backgroundColor,
  }));

  const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'];
  const currentLinks = links || [];

  const togglePlatform = (platform: string) => {
    const exists = currentLinks.find((l: SocialLink) => l.platform === platform);
    if (exists) {
      setProp((props: SocialLinksProps) => {
        props.links = currentLinks.filter((l: SocialLink) => l.platform !== platform);
      });
    } else {
      setProp((props: SocialLinksProps) => {
        props.links = [...currentLinks, { platform: platform as SocialLink['platform'], url: '#' }];
      });
    }
  };

  const updateUrl = (platform: string, url: string) => {
    setProp((props: SocialLinksProps) => {
      props.links = currentLinks.map((l: SocialLink) =>
        l.platform === platform ? { ...l, url } : l
      );
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Platforms</label>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((platform) => (
            <label key={platform} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={currentLinks.some((l: SocialLink) => l.platform === platform)}
                onChange={() => togglePlatform(platform)}
                className="rounded"
              />
              <span className="capitalize">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      {currentLinks.map((link: SocialLink) => (
        <div key={link.platform}>
          <label className="block text-sm font-medium mb-1 capitalize">{link.platform} URL</label>
          <input
            type="text"
            value={link.url}
            onChange={(e) => updateUrl(link.platform, e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="https://..."
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium mb-1">Icon Size</label>
        <input
          type="range"
          min={20}
          max={48}
          value={iconSize || 32}
          onChange={(e) => setProp((props: SocialLinksProps) => (props.iconSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{iconSize}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gap</label>
        <input
          type="range"
          min={8}
          max={32}
          value={gap || 16}
          onChange={(e) => setProp((props: SocialLinksProps) => (props.gap = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{gap}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={align || 'center'}
          onChange={(e) => setProp((props: SocialLinksProps) => (props.align = e.target.value as 'left' | 'center' | 'right'))}
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
          value={backgroundColor || '#ffffff'}
          onChange={(e) => setProp((props: SocialLinksProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={40}
          value={padding || 16}
          onChange={(e) => setProp((props: SocialLinksProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

SocialLinks.craft = {
  props: {
    links: [
      { platform: 'facebook', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'linkedin', url: '#' },
    ],
    iconSize: 32,
    iconColor: '#333333',
    backgroundColor: 'transparent',
    align: 'center',
    padding: 16,
    gap: 16,
  },
  related: {
    settings: SocialLinksSettings,
  },
};
