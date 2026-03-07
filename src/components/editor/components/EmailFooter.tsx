import React from 'react';
import { useNode } from '@craftjs/core';

interface EmailFooterProps {
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
}

export const EmailFooter = ({
  companyName = 'Your Company',
  address = '123 Business St, City, Country',
  email = 'info@company.com',
  phone = '+1 234 567 890',
  backgroundColor = '#f5f5f5',
  textColor = '#666666',
  padding = 24,
}: EmailFooterProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <p style={{ color: textColor, fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
        {companyName}
      </p>
      <p style={{ color: textColor, fontSize: '12px', margin: '0 0 4px 0' }}>
        {address}
      </p>
      <p style={{ color: textColor, fontSize: '12px', margin: '0 0 4px 0' }}>
        Email: {email} | Phone: {phone}
      </p>
      <p style={{ color: textColor, fontSize: '11px', margin: '12px 0 0 0', opacity: 0.7 }}>
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </p>
    </div>
  );
};

const EmailFooterSettings = () => {
  const { actions: { setProp }, companyName, address, email, phone, backgroundColor, textColor, padding } = useNode((node) => ({
    companyName: node.data.props.companyName,
    address: node.data.props.address,
    email: node.data.props.email,
    phone: node.data.props.phone,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    padding: node.data.props.padding,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          value={companyName || ''}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.companyName = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={address || ''}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.address = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email || ''}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.email = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          value={phone || ''}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.phone = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#f5f5f5'}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          type="color"
          value={textColor || '#666666'}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.textColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={60}
          value={padding || 24}
          onChange={(e) => setProp((props: EmailFooterProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

EmailFooter.craft = {
  props: {
    companyName: 'Your Company',
    address: '123 Business St, City, Country',
    email: 'info@company.com',
    phone: '+1 234 567 890',
    backgroundColor: '#f5f5f5',
    textColor: '#666666',
    padding: 24,
  },
  related: {
    settings: EmailFooterSettings,
  },
};
