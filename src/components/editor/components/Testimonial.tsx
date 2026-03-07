import React from 'react';
import { useNode } from '@craftjs/core';

interface TestimonialProps {
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  authorImage?: string;
  backgroundColor?: string;
  quoteColor?: string;
  authorColor?: string;
  accentColor?: string;
  padding?: number;
  showQuoteIcon?: boolean;
}

export const Testimonial = ({
  quote = "This product has completely transformed how we do business. The results have been incredible!",
  authorName = 'Sarah Johnson',
  authorTitle = 'CEO, TechCorp',
  authorImage = '',
  backgroundColor = '#f8f9fa',
  quoteColor = '#333333',
  authorColor = '#666666',
  accentColor = '#0066cc',
  padding = 24,
  showQuoteIcon = true,
}: TestimonialProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      style={{
        backgroundColor,
        padding: `${padding}px`,
        borderLeft: `4px solid ${accentColor}`,
        margin: '10px',
      }}
    >
      {showQuoteIcon && (
        <div
          style={{
            fontSize: '48px',
            color: accentColor,
            opacity: 0.3,
            lineHeight: 1,
            marginBottom: '-20px',
            fontFamily: 'Georgia, serif',
          }}
        >
          "
        </div>
      )}
      
      <p
        style={{
          fontSize: '16px',
          fontStyle: 'italic',
          color: quoteColor,
          lineHeight: 1.7,
          margin: '0 0 16px 0',
          fontFamily: 'Georgia, serif',
        }}
      >
        {quote}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {authorImage && (
          <img
            src={authorImage}
            alt={authorName}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}
        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: quoteColor,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {authorName}
          </div>
          {authorTitle && (
            <div
              style={{
                fontSize: '12px',
                color: authorColor,
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {authorTitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialSettings = () => {
  const {
    actions: { setProp },
    quote,
    authorName,
    authorTitle,
    authorImage,
    backgroundColor,
    quoteColor,
    authorColor,
    accentColor,
    padding,
    showQuoteIcon,
  } = useNode((node) => ({
    quote: node.data.props.quote,
    authorName: node.data.props.authorName,
    authorTitle: node.data.props.authorTitle,
    authorImage: node.data.props.authorImage,
    backgroundColor: node.data.props.backgroundColor,
    quoteColor: node.data.props.quoteColor,
    authorColor: node.data.props.authorColor,
    accentColor: node.data.props.accentColor,
    padding: node.data.props.padding,
    showQuoteIcon: node.data.props.showQuoteIcon,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Quote</label>
        <textarea
          value={quote || ''}
          onChange={(e) => setProp((props: TestimonialProps) => (props.quote = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Author Name</label>
        <input
          type="text"
          value={authorName || ''}
          onChange={(e) => setProp((props: TestimonialProps) => (props.authorName = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Author Title</label>
        <input
          type="text"
          value={authorTitle || ''}
          onChange={(e) => setProp((props: TestimonialProps) => (props.authorTitle = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Author Image URL</label>
        <input
          type="text"
          value={authorImage || ''}
          onChange={(e) => setProp((props: TestimonialProps) => (props.authorImage = e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showQuoteIcon !== false}
            onChange={(e) => setProp((props: TestimonialProps) => (props.showQuoteIcon = e.target.checked))}
            className="rounded"
          />
          Show Quote Icon
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          type="color"
          value={backgroundColor || '#f8f9fa'}
          onChange={(e) => setProp((props: TestimonialProps) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Accent Color</label>
        <input
          type="color"
          value={accentColor || '#0066cc'}
          onChange={(e) => setProp((props: TestimonialProps) => (props.accentColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Quote Color</label>
        <input
          type="color"
          value={quoteColor || '#333333'}
          onChange={(e) => setProp((props: TestimonialProps) => (props.quoteColor = e.target.value))}
          className="w-full h-10 rounded border cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Padding</label>
        <input
          type="range"
          min={12}
          max={48}
          value={padding || 24}
          onChange={(e) => setProp((props: TestimonialProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-sm text-muted-foreground">{padding}px</span>
      </div>
    </div>
  );
};

Testimonial.craft = {
  props: {
    quote: "This product has completely transformed how we do business. The results have been incredible!",
    authorName: 'Sarah Johnson',
    authorTitle: 'CEO, TechCorp',
    authorImage: '',
    backgroundColor: '#f8f9fa',
    quoteColor: '#333333',
    authorColor: '#666666',
    accentColor: '#0066cc',
    padding: 24,
    showQuoteIcon: true,
  },
  related: {
    settings: TestimonialSettings,
  },
};
