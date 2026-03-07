import { SerializedNodes } from '@craftjs/core';
import type { HtmlRenderer } from '../components/editor';

interface NodeData {
  type: { resolvedName: string };
  props: Record<string, unknown>;
  nodes: string[];
  linkedNodes?: Record<string, string>;
}

export const generateEmailHtml = (
  nodes: SerializedNodes,
  customRenderers?: Record<string, HtmlRenderer>
): string => {
  const renderNode = (nodeId: string): string => {
    const node = nodes[nodeId] as unknown as NodeData;
    if (!node) return '';

    const { type, props, nodes: childNodes, linkedNodes } = node;
    const typeName = type.resolvedName;

    let childrenHtml = '';
    if (childNodes && childNodes.length > 0) {
      childrenHtml = childNodes.map((childId: string) => renderNode(childId)).join('');
    }
    if (linkedNodes) {
      Object.values(linkedNodes).forEach((linkedId: string) => {
        childrenHtml += renderNode(linkedId);
      });
    }

    // Check custom renderers first
    if (customRenderers?.[typeName]) {
      const result = customRenderers[typeName](typeName, props, childrenHtml, linkedNodes);
      if (result !== null) return result;
    }

    switch (typeName) {
      case 'Paper':
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email Template</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: ${props.background || '#ffffff'}; max-width: 600px;">
          <tr>
            <td>
${childrenHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      case 'Container':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: ${props.background || '#ffffff'}; padding: ${props.padding || 20}px;">
${childrenHtml}
                  </td>
                </tr>
              </table>`;

      case 'TwoColumn': {
        const leftWidth = (props.leftWidth as number) || 50;
        const rightWidth = 100 - leftWidth;
        const leftHtml = linkedNodes?.['left-column'] ? renderNode(linkedNodes['left-column']) : '';
        const rightHtml = linkedNodes?.['right-column'] ? renderNode(linkedNodes['right-column']) : '';
        
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${props.backgroundColor || '#ffffff'}; padding: ${props.padding || 10}px;">
                <tr>
                  <td width="${leftWidth}%" valign="top" style="padding-right: ${(props.gap as number) / 2 || 10}px;">
                    ${leftHtml}
                  </td>
                  <td width="${rightWidth}%" valign="top" style="padding-left: ${(props.gap as number) / 2 || 10}px;">
                    ${rightHtml}
                  </td>
                </tr>
              </table>`;
      }

      case 'EmailHeader':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: ${props.backgroundColor || '#1a1a2e'}; padding: ${props.padding || 24}px; text-align: center;">
                    ${props.logoUrl ? `<img src="${props.logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 12px;">` : ''}
                    <h1 style="color: ${props.textColor || '#ffffff'}; font-size: 24px; font-weight: bold; margin: 0; font-family: Arial, sans-serif;">${props.companyName || 'Your Company'}</h1>
                  </td>
                </tr>
              </table>`;

      case 'EmailFooter':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: ${props.backgroundColor || '#f5f5f5'}; padding: ${props.padding || 24}px; text-align: center; font-family: Arial, sans-serif;">
                    <p style="color: ${props.textColor || '#666666'}; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">${props.companyName || 'Your Company'}</p>
                    <p style="color: ${props.textColor || '#666666'}; font-size: 12px; margin: 0 0 4px 0;">${props.address || '123 Business St, City, Country'}</p>
                    <p style="color: ${props.textColor || '#666666'}; font-size: 12px; margin: 0 0 4px 0;">Email: ${props.email || 'info@company.com'} | Phone: ${props.phone || '+1 234 567 890'}</p>
                    <p style="color: ${props.textColor || '#666666'}; font-size: 11px; margin: 12px 0 0 0; opacity: 0.7;">© ${new Date().getFullYear()} ${props.companyName || 'Your Company'}. All rights reserved.</p>
                  </td>
                </tr>
              </table>`;

      case 'EmailButton':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: ${props.align || 'center'}; padding: 10px 0;">
                    <a href="${props.href || '#'}" style="display: inline-block; background-color: ${props.backgroundColor || '#0066cc'}; color: ${props.textColor || '#ffffff'}; padding: ${props.paddingY || 12}px ${props.paddingX || 24}px; border-radius: ${props.borderRadius || 6}px; text-decoration: none; font-size: ${props.fontSize || 16}px; font-weight: bold; font-family: Arial, sans-serif;">${props.text || 'Click Here'}</a>
                  </td>
                </tr>
              </table>`;

      case 'TextBlock':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: ${props.padding || 10}px;">
                    <p style="font-size: ${props.fontSize || 14}px; font-weight: ${props.fontWeight || 'normal'}; color: ${props.color || '#333333'}; text-align: ${props.align || 'left'}; line-height: ${props.lineHeight || 1.6}; margin: 0; font-family: Arial, sans-serif;">${props.text || 'Enter your text here...'}</p>
                  </td>
                </tr>
              </table>`;

      case 'VariableText':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: ${props.padding || 10}px;">
                    <p style="font-size: ${props.fontSize || 14}px; font-weight: ${props.fontWeight || 'normal'}; color: ${props.color || '#333333'}; text-align: ${props.align || 'left'}; line-height: ${props.lineHeight || 1.6}; margin: 0; font-family: Arial, sans-serif;">${props.text || ''}</p>
                  </td>
                </tr>
              </table>`;

      case 'ImageBlock':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: ${props.align || 'center'}; padding: ${props.padding || 10}px;">
                    <img src="${props.src || 'https://via.placeholder.com/400x200'}" alt="${props.alt || 'Image'}" style="width: ${props.width || '100%'}; max-width: 100%; border-radius: ${props.borderRadius || 0}px; display: inline-block;">
                  </td>
                </tr>
              </table>`;

      case 'VideoPlaceholder':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: ${props.align || 'center'}; padding: ${props.padding || 10}px;">
                    <a href="${props.videoUrl || '#'}" style="display: inline-block; position: relative; text-decoration: none;">
                      <img src="${props.thumbnailUrl || 'https://via.placeholder.com/600x338'}" alt="Video thumbnail" style="width: ${props.width || '100%'}; max-width: 100%; border-radius: ${props.borderRadius || 8}px; display: block;">
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; background: rgba(0,0,0,0.6); border-radius: 50%; border: 3px solid ${props.playButtonColor || '#ffffff'};">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-40%, -50%); width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 20px solid ${props.playButtonColor || '#ffffff'};"></div>
                      </div>
                    </a>
                  </td>
                </tr>
              </table>`;

      case 'Divider':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: ${props.margin || 20}px 0; text-align: center;">
                    <hr style="border: none; border-top: ${props.thickness || 1}px solid ${props.color || '#e0e0e0'}; width: ${props.width || '100%'}; margin: 0 auto;">
                  </td>
                </tr>
              </table>`;

      case 'Spacer':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="height: ${props.height || 20}px; line-height: ${props.height || 20}px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>`;

      case 'SocialLinks': {
        const links = (props.links as Array<{ platform: string; url: string }>) || [];
        const iconSize = (props.iconSize as number) || 32;
        const gap = (props.gap as number) || 16;
        
        const socialIcons: Record<string, string> = {
          facebook: 'https://cdn-icons-png.flaticon.com/128/733/733547.png',
          twitter: 'https://cdn-icons-png.flaticon.com/128/733/733579.png',
          instagram: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png',
          linkedin: 'https://cdn-icons-png.flaticon.com/128/3536/3536505.png',
          youtube: 'https://cdn-icons-png.flaticon.com/128/1384/1384060.png',
          tiktok: 'https://cdn-icons-png.flaticon.com/128/3046/3046121.png',
        };

        const iconsHtml = links.map((link) => `
          <a href="${link.url}" style="display: inline-block; margin: 0 ${gap / 2}px;">
            <img src="${socialIcons[link.platform] || ''}" alt="${link.platform}" style="width: ${iconSize}px; height: ${iconSize}px;">
          </a>
        `).join('');

        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: ${props.align || 'center'}; padding: ${props.padding || 16}px; background-color: ${props.backgroundColor || 'transparent'};">
                    ${iconsHtml}
                  </td>
                </tr>
              </table>`;
      }

      case 'Countdown': {
        const boxStyle = `background: ${props.boxBackground || 'rgba(0,0,0,0.2)'}; padding: 12px 16px; border-radius: 8px; text-align: center; display: inline-block; margin: 0 6px;`;
        const numberStyle = `font-size: 28px; font-weight: bold; color: ${props.numberColor || '#ffffff'}; font-family: Arial, sans-serif;`;
        const labelStyle = `font-size: 11px; color: ${props.labelColor || '#ffffff'}; text-transform: uppercase; letter-spacing: 1px;`;

        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: ${props.backgroundColor || '#ff6b6b'}; padding: ${props.padding || 24}px; text-align: center;">
                    ${props.title ? `<h3 style="color: ${props.titleColor || '#ffffff'}; font-size: 18px; font-weight: bold; margin: 0 0 16px 0; font-family: Arial, sans-serif;">${props.title}</h3>` : ''}
                    <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                      <tr>
                        <td style="${boxStyle}">
                          <div style="${numberStyle}">${String(props.days || 0).padStart(2, '0')}</div>
                          <div style="${labelStyle}">Days</div>
                        </td>
                        <td style="${boxStyle}">
                          <div style="${numberStyle}">${String(props.hours || 0).padStart(2, '0')}</div>
                          <div style="${labelStyle}">Hours</div>
                        </td>
                        <td style="${boxStyle}">
                          <div style="${numberStyle}">${String(props.minutes || 0).padStart(2, '0')}</div>
                          <div style="${labelStyle}">Mins</div>
                        </td>
                        <td style="${boxStyle}">
                          <div style="${numberStyle}">${String(props.seconds || 0).padStart(2, '0')}</div>
                          <div style="${labelStyle}">Secs</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>`;
      }

      case 'PromoCode':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 10px;">
                    <div style="background-color: ${props.backgroundColor || '#fff8e1'}; border: 2px ${props.borderStyle || 'dashed'} ${props.borderColor || '#ffc107'}; border-radius: 8px; padding: ${props.padding || 24}px; text-align: center;">
                      ${props.title ? `<div style="font-size: 18px; font-weight: bold; color: ${props.textColor || '#333333'}; margin-bottom: 12px; font-family: Arial, sans-serif;">${props.title}</div>` : ''}
                      <div style="display: inline-block; background-color: ${props.codeBackground || '#ffffff'}; border: 1px solid ${props.borderColor || '#ffc107'}; border-radius: 6px; padding: 12px 24px; margin-bottom: 12px;">
                        <span style="font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 3px; color: ${props.codeColor || '#e65100'};">${props.code || 'SAVE20'}</span>
                      </div>
                      ${props.description ? `<div style="font-size: 14px; color: ${props.textColor || '#333333'}; font-family: Arial, sans-serif; opacity: 0.8;">${props.description}</div>` : ''}
                    </div>
                  </td>
                </tr>
              </table>`;

      case 'Testimonial':
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 10px;">
                    <div style="background-color: ${props.backgroundColor || '#f8f9fa'}; padding: ${props.padding || 24}px; border-left: 4px solid ${props.accentColor || '#0066cc'};">
                      ${props.showQuoteIcon !== false ? `<div style="font-size: 48px; color: ${props.accentColor || '#0066cc'}; opacity: 0.3; line-height: 1; margin-bottom: -20px; font-family: Georgia, serif;">"</div>` : ''}
                      <p style="font-size: 16px; font-style: italic; color: ${props.quoteColor || '#333333'}; line-height: 1.7; margin: 0 0 16px 0; font-family: Georgia, serif;">${props.quote || ''}</p>
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          ${props.authorImage ? `<td style="vertical-align: middle; padding-right: 12px;"><img src="${props.authorImage}" alt="${props.authorName}" style="width: 48px; height: 48px; border-radius: 50%;"></td>` : ''}
                          <td style="vertical-align: middle;">
                            <div style="font-size: 14px; font-weight: bold; color: ${props.quoteColor || '#333333'}; font-family: Arial, sans-serif;">${props.authorName || ''}</div>
                            ${props.authorTitle ? `<div style="font-size: 12px; color: ${props.authorColor || '#666666'}; font-family: Arial, sans-serif;">${props.authorTitle}</div>` : ''}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>`;

      case 'IconList': {
        const items = (props.items as Array<{ icon: string; text: string }>) || [];
        const icons: Record<string, string> = {
          check: '✓', star: '★', arrow: '→', bullet: '•', heart: '❤',
          fire: '🔥', rocket: '🚀', sparkle: '✨', gift: '🎁', clock: '⏰',
        };

        const listHtml = items.map((item) => `
          <tr>
            <td style="vertical-align: top; padding-right: 10px; color: ${props.iconColor || '#22c55e'}; font-size: ${props.iconSize || 18}px; line-height: 1.5;">${icons[item.icon] || item.icon}</td>
            <td style="vertical-align: top; color: ${props.textColor || '#333333'}; font-size: ${props.fontSize || 14}px; line-height: 1.5; padding-bottom: ${props.gap || 12}px; font-family: Arial, sans-serif;">${item.text}</td>
          </tr>
        `).join('');

        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: ${props.padding || 16}px; background-color: ${props.backgroundColor || 'transparent'};">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      ${listHtml}
                    </table>
                  </td>
                </tr>
              </table>`;
      }

      case 'InvoiceTable': {
        const items = (props.items as Array<{ description: string; quantity: number; unitPrice: number }>) || [];
        const currency = (props.currency as string) || '$';
        const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        
        const headerStyle = `background-color: ${props.headerBg || '#1a1a2e'}; color: ${props.headerColor || '#ffffff'}; padding: 12px 16px; font-weight: bold; text-align: left; border-bottom: 1px solid ${props.borderColor || '#e0e0e0'};`;
        const cellStyle = `padding: 12px 16px; border-bottom: 1px solid ${props.borderColor || '#e0e0e0'}; font-family: Arial, sans-serif; font-size: 14px;`;
        
        return `
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid ${props.borderColor || '#e0e0e0'};">
                      <tr>
                        <th style="${headerStyle}">Description</th>
                        <th style="${headerStyle} text-align: center; width: 80px;">Qty</th>
                        <th style="${headerStyle} text-align: right; width: 100px;">Unit Price</th>
                        <th style="${headerStyle} text-align: right; width: 100px;">Amount</th>
                      </tr>
                      ${items.map(item => `
                      <tr>
                        <td style="${cellStyle}">${item.description}</td>
                        <td style="${cellStyle} text-align: center;">${item.quantity}</td>
                        <td style="${cellStyle} text-align: right;">${currency}${item.unitPrice.toFixed(2)}</td>
                        <td style="${cellStyle} text-align: right;">${currency}${(item.quantity * item.unitPrice).toFixed(2)}</td>
                      </tr>`).join('')}
                      ${props.showTotal !== false ? `
                      <tr>
                        <td colspan="3" style="${cellStyle} text-align: right; font-weight: bold;">Total:</td>
                        <td style="${cellStyle} text-align: right; font-weight: bold; background-color: #f5f5f5;">${currency}${total.toFixed(2)}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>`;
      }

      default:
        return childrenHtml;
    }
  };

  return renderNode('ROOT');
};
