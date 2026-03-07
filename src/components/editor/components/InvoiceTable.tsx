import React from 'react';
import { useNode } from '@craftjs/core';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceTableProps {
  items?: InvoiceItem[];
  headerBg?: string;
  headerColor?: string;
  borderColor?: string;
  showTotal?: boolean;
  currency?: string;
}

export const InvoiceTable = ({
  items = [
    { description: 'Service Item 1', quantity: 1, unitPrice: 100 },
    { description: 'Service Item 2', quantity: 2, unitPrice: 50 },
  ],
  headerBg = '#1a1a2e',
  headerColor = '#ffffff',
  borderColor = '#e0e0e0',
  showTotal = true,
  currency = '$',
}: InvoiceTableProps) => {
  const { connectors: { connect, drag } } = useNode();

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderBottom: `1px solid ${borderColor}`,
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: headerBg,
    color: headerColor,
    fontWeight: 'bold',
    textAlign: 'left',
  };

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{ padding: '10px' }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: `1px solid ${borderColor}`,
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Description</th>
            <th style={{ ...headerStyle, textAlign: 'center', width: '80px' }}>Qty</th>
            <th style={{ ...headerStyle, textAlign: 'right', width: '100px' }}>Unit Price</th>
            <th style={{ ...headerStyle, textAlign: 'right', width: '100px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={cellStyle}>{item.description}</td>
              <td style={{ ...cellStyle, textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>{currency}{item.unitPrice.toFixed(2)}</td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>{currency}{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {showTotal && (
          <tfoot>
            <tr>
              <td colSpan={3} style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
              <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                {currency}{total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

const InvoiceTableSettings = () => {
  const { actions: { setProp }, items, headerBg, headerColor, borderColor, showTotal, currency } = useNode((node) => ({
    items: node.data.props.items,
    headerBg: node.data.props.headerBg,
    headerColor: node.data.props.headerColor,
    borderColor: node.data.props.borderColor,
    showTotal: node.data.props.showTotal,
    currency: node.data.props.currency,
  }));

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setProp((props: InvoiceTableProps) => {
      const newItems = [...(props.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      props.items = newItems;
    });
  };

  const addItem = () => {
    setProp((props: InvoiceTableProps) => {
      props.items = [...(props.items || []), { description: 'New Item', quantity: 1, unitPrice: 0 }];
    });
  };

  const removeItem = (index: number) => {
    setProp((props: InvoiceTableProps) => {
      props.items = (props.items || []).filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Invoice Items</label>
        {(items || []).map((item, index) => (
          <div key={index} className="mb-3 p-3 border rounded-md bg-muted/30">
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm mb-2"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border rounded text-sm"
                placeholder="Qty"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                className="flex-1 px-2 py-1 border rounded text-sm"
                placeholder="Price"
              />
              <button
                onClick={() => removeItem(index)}
                className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="w-full py-2 border-2 border-dashed rounded-md text-sm text-muted-foreground hover:bg-muted/50"
        >
          + Add Item
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Currency Symbol</label>
        <input
          type="text"
          value={currency || '$'}
          onChange={(e) => setProp((props: InvoiceTableProps) => (props.currency = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Header Background</label>
        <input
          type="color"
          value={headerBg || '#1a1a2e'}
          onChange={(e) => setProp((props: InvoiceTableProps) => (props.headerBg = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Header Text Color</label>
        <input
          type="color"
          value={headerColor || '#ffffff'}
          onChange={(e) => setProp((props: InvoiceTableProps) => (props.headerColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Border Color</label>
        <input
          type="color"
          value={borderColor || '#e0e0e0'}
          onChange={(e) => setProp((props: InvoiceTableProps) => (props.borderColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showTotal ?? true}
          onChange={(e) => setProp((props: InvoiceTableProps) => (props.showTotal = e.target.checked))}
          className="rounded"
        />
        <label className="text-sm font-medium">Show Total Row</label>
      </div>
    </div>
  );
};

InvoiceTable.craft = {
  props: {
    items: [
      { description: 'Service Item 1', quantity: 1, unitPrice: 100 },
      { description: 'Service Item 2', quantity: 2, unitPrice: 50 },
    ],
    headerBg: '#1a1a2e',
    headerColor: '#ffffff',
    borderColor: '#e0e0e0',
    showTotal: true,
    currency: '$',
  },
  related: {
    settings: InvoiceTableSettings,
  },
};
