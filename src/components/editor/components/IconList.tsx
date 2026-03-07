import React from 'react';
import { useNode } from '@craftjs/core';

interface ListItem {
  icon: string;
  text: string;
}

interface IconListProps {
  items?: ListItem[];
  iconColor?: string;
  textColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  iconSize?: number;
  gap?: number;
  padding?: number;
}

const ICONS = {
  check: '✓',
  star: '★',
  arrow: '→',
  bullet: '•',
  heart: '❤',
  fire: '🔥',
  rocket: '🚀',
  sparkle: '✨',
  gift: '🎁',
  clock: '⏰',
};

export const IconList = ({
  items = [
    { icon: 'check', text: 'Fast and reliable delivery' },
    { icon: 'check', text: 'Premium quality products' },
    { icon: 'check', text: '24/7 customer support' },
    { icon: 'check', text: '30-day money back guarantee' },
  ],
  iconColor = '#22c55e',
  textColor = '#333333',
  backgroundColor = 'transparent',
  fontSize = 14,
  iconSize = 18,
  gap = 12,
  padding = 16,
}: IconListProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        padding: `${padding}px`,
        backgroundColor,
      }}
    >
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <span
              style={{
                color: iconColor,
                fontSize: `${iconSize}px`,
                lineHeight: 1.4,
                flexShrink: 0,
              }}
            >
              {ICONS[item.icon as keyof typeof ICONS] || item.icon}
            </span>
            <span
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                lineHeight: 1.5,
              }}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IconListSettings = () => {
  const {
    actions: { setProp },
    items,
    iconColor,
    textColor,
    backgroundColor,
    fontSize,
    iconSize,
    gap,
    padding,
  } = useNode((node) => ({
    items: node.data.props.items,
    iconColor: node.data.props.iconColor,
    textColor: node.data.props.textColor,
    backgroundColor: node.data.props.backgroundColor,
    fontSize: node.data.props.fontSize,
    iconSize: node.data.props.iconSize,
    gap: node.data.props.gap,
    padding: node.data.props.padding,
  }));

  const currentItems = items || [];

  const updateItem = (index: number, field: 'icon' | 'text', value: string) => {
    setProp((props: IconListProps) => {
      props.items = currentItems.map((item: ListItem, i: number) =>
        i === index ? { ...item, [field]: value } : item
      );
    });
  };

  const addItem = () => {
    setProp((props: IconListProps) => {
      props.items = [...currentItems, { icon: 'check', text: 'New item' }];
    });
  };

  const removeItem = (index: number) => {
    setProp((props: IconListProps) => {
      props.items = currentItems.filter((_: ListItem, i: number) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">List Items</label>
        <div className="space-y-3">
          {currentItems.map((item: ListItem, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <select
                value={item.icon}
                onChange={(e) => updateItem(index, 'icon', e.target.value)}
                className="w-16 px-2 py-2 border rounded-md text-sm"
              >
                {Object.entries(ICONS).map(([key, icon]) => (
                  <option key={key} value={key}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(index, 'text', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              <button
                onClick={() => removeItem(index)}
                className="px-2 py-2 text-destructive hover:bg-destructive/10 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 w-full py-2 text-sm border border-dashed rounded-md hover:bg-accent transition-colors"
        >
          + Add Item
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Icon Color</label>
        <input
          type="color"
          value={iconColor || '#22c55e'}
          onChange={(e) => setProp((props: IconListProps) => (props.iconColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={textColor || '#333333'}
          onChange={(e) => setProp((props: IconListProps) => (props.textColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input
          type="range"
          min={12}
          max={20}
          value={fontSize || 14}
          onChange={(e) => setProp((props: IconListProps) => (props.fontSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{fontSize}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Icon Size</label>
        <input
          type="range"
          min={14}
          max={28}
          value={iconSize || 18}
          onChange={(e) => setProp((props: IconListProps) => (props.iconSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{iconSize}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gap</label>
        <input
          type="range"
          min={4}
          max={24}
          value={gap || 12}
          onChange={(e) => setProp((props: IconListProps) => (props.gap = parseInt(e.target.value)))}
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
          value={padding || 16}
          onChange={(e) => setProp((props: IconListProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

IconList.craft = {
  props: {
    items: [
      { icon: 'check', text: 'Fast and reliable delivery' },
      { icon: 'check', text: 'Premium quality products' },
      { icon: 'check', text: '24/7 customer support' },
      { icon: 'check', text: '30-day money back guarantee' },
    ],
    iconColor: '#22c55e',
    textColor: '#333333',
    backgroundColor: 'transparent',
    fontSize: 14,
    iconSize: 18,
    gap: 12,
    padding: 16,
  },
  related: {
    settings: IconListSettings,
  },
};
