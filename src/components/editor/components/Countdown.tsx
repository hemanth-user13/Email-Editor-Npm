import React from 'react';
import { useNode } from '@craftjs/core';

interface CountdownProps {
  title?: string;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  backgroundColor?: string;
  numberColor?: string;
  labelColor?: string;
  titleColor?: string;
  boxBackground?: string;
  padding?: number;
}

export const Countdown = ({
  title = 'Sale Ends In',
  days = 3,
  hours = 12,
  minutes = 45,
  seconds = 30,
  backgroundColor = '#ff6b6b',
  numberColor = '#ffffff',
  labelColor = '#ffffff',
  titleColor = '#ffffff',
  boxBackground = 'rgba(0,0,0,0.2)',
  padding = 24,
}: CountdownProps) => {
  const { connectors: { connect, drag } } = useNode();

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div
      style={{
        background: boxBackground,
        padding: '12px 16px',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '60px',
      }}
    >
      <div
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: numberColor,
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.2,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: labelColor,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginTop: '4px',
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        textAlign: 'center',
      }}
    >
      {title && (
        <h3
          style={{
            color: titleColor,
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            fontFamily: 'Arial, sans-serif',
            margin: '0 0 16px 0',
          }}
        >
          {title}
        </h3>
      )}
      <div
        style={{
          display: 'inline-flex',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        <TimeBox value={days} label="Days" />
        <TimeBox value={hours} label="Hours" />
        <TimeBox value={minutes} label="Mins" />
        <TimeBox value={seconds} label="Secs" />
      </div>
    </div>
  );
};

const CountdownSettings = () => {
  const {
    actions: { setProp },
    title,
    days,
    hours,
    minutes,
    seconds,
    backgroundColor,
    numberColor,
    labelColor,
    titleColor,
    boxBackground,
    padding,
  } = useNode((node) => ({
    title: node.data.props.title,
    days: node.data.props.days,
    hours: node.data.props.hours,
    minutes: node.data.props.minutes,
    seconds: node.data.props.seconds,
    backgroundColor: node.data.props.backgroundColor,
    numberColor: node.data.props.numberColor,
    labelColor: node.data.props.labelColor,
    titleColor: node.data.props.titleColor,
    boxBackground: node.data.props.boxBackground,
    padding: node.data.props.padding,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title || ''}
          onChange={(e) => setProp((props: CountdownProps) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Days</label>
          <input
            type="number"
            min={0}
            value={days || 0}
            onChange={(e) => setProp((props: CountdownProps) => (props.days = parseInt(e.target.value)))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hours</label>
          <input
            type="number"
            min={0}
            max={23}
            value={hours || 0}
            onChange={(e) => setProp((props: CountdownProps) => (props.hours = parseInt(e.target.value)))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Minutes</label>
          <input
            type="number"
            min={0}
            max={59}
            value={minutes || 0}
            onChange={(e) => setProp((props: CountdownProps) => (props.minutes = parseInt(e.target.value)))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Seconds</label>
          <input
            type="number"
            min={0}
            max={59}
            value={seconds || 0}
            onChange={(e) => setProp((props: CountdownProps) => (props.seconds = parseInt(e.target.value)))}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#ff6b6b'}
          onChange={(e) => setProp((props: CountdownProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title Color</label>
        <input
          type="color"
          value={titleColor || '#ffffff'}
          onChange={(e) => setProp((props: CountdownProps) => (props.titleColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Number Color</label>
        <input
          type="color"
          value={numberColor || '#ffffff'}
          onChange={(e) => setProp((props: CountdownProps) => (props.numberColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={8}
          max={48}
          value={padding || 24}
          onChange={(e) => setProp((props: CountdownProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

Countdown.craft = {
  props: {
    title: 'Sale Ends In',
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30,
    backgroundColor: '#ff6b6b',
    numberColor: '#ffffff',
    labelColor: '#ffffff',
    titleColor: '#ffffff',
    boxBackground: 'rgba(0,0,0,0.2)',
    padding: 24,
  },
  related: {
    settings: CountdownSettings,
  },
};
