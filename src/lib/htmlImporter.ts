/**
 * HTML Importer — parses exported HTML (with embedded data-component attributes)
 * and reconstructs a Craft.js serialized JSON state for the editor.
 */

interface CraftNode {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: Record<string, unknown>;
  displayName: string;
  custom: Record<string, unknown>;
  hidden: boolean;
  nodes: string[];
  linkedNodes: Record<string, string>;
  parent?: string;
}

type CraftNodes = Record<string, CraftNode>;

let nodeCounter = 0;

const generateNodeId = (): string => {
  nodeCounter++;
  return `imported_${nodeCounter}_${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Decode props from a base64 data-props attribute.
 */
const decodeProps = (encoded: string): Record<string, unknown> | null => {
  try {
    const json = atob(encoded);
    const parsed = JSON.parse(json);
    // Remove the internal _type marker
    const { _type, ...props } = parsed;
    return props;
  } catch {
    return null;
  }
};

/**
 * Parse HTML string and extract component markers.
 * Returns a Craft.js serialized state string ready for `actions.deserialize()`.
 */
export const importHtmlToState = (html: string): string => {
  nodeCounter = 0;

  console.log("html is",html)

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Find all elements with data-component attribute
  const componentEls = doc.querySelectorAll('[data-component]');

  const nodes: CraftNodes = {};
  const childNodeIds: string[] = [];

  // Process each top-level component marker
  // We need to find only top-level ones (not nested inside other data-component elements)
  const topLevelComponents: Element[] = [];
  componentEls.forEach((el) => {
    // Check if this element is nested inside another data-component element
    let parent = el.parentElement;
    let isNested = false;
    while (parent) {
      if (parent.hasAttribute('data-component')) {
        isNested = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!isNested) {
      topLevelComponents.push(el);
    }
  });

  // If no component markers found, wrap the entire HTML in a RawHtml block
  if (topLevelComponents.length === 0) {
    const rawNodeId = generateNodeId();
    nodes[rawNodeId] = {
      type: { resolvedName: 'RawHtml' },
      isCanvas: false,
      props: { html: html, padding: 0 },
      displayName: 'RawHtml',
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {},
      parent: 'ROOT',
    };
    childNodeIds.push(rawNodeId);
  } else {
    for (const el of topLevelComponents) {
      const typeName = el.getAttribute('data-component') || 'RawHtml';
      const encodedProps = el.getAttribute('data-props') || '';
      const props = decodeProps(encodedProps);

      if (!props) continue;

      const nodeId = generateNodeId();

      // Handle Container type — it's a canvas node that may have nested children
      const isCanvas = typeName === 'Container' || typeName === 'Paper';

      // For Container nodes, recursively process nested components
      const nestedChildren: string[] = [];
      const nestedLinkedNodes: Record<string, string> = {};

      if (typeName === 'Container') {
        const nestedEls = el.querySelectorAll(':scope > div > [data-component], :scope [data-component]');
        nestedEls.forEach((nestedEl) => {
          // Only direct children of this container
          let nestedParent = nestedEl.parentElement;
          let belongsToThis = false;
          while (nestedParent && nestedParent !== el) {
            if (nestedParent.hasAttribute('data-component') && nestedParent !== el) {
              break;
            }
            if (nestedParent === el) {
              belongsToThis = true;
            }
            nestedParent = nestedParent.parentElement;
          }
          if (nestedParent === el) belongsToThis = true;

          if (belongsToThis) {
            const nestedType = nestedEl.getAttribute('data-component') || 'RawHtml';
            const nestedEncoded = nestedEl.getAttribute('data-props') || '';
            const nestedProps = decodeProps(nestedEncoded);
            if (nestedProps) {
              const childId = generateNodeId();
              nodes[childId] = {
                type: { resolvedName: nestedType },
                isCanvas: false,
                props: nestedProps,
                displayName: nestedType,
                custom: {},
                hidden: false,
                nodes: [],
                linkedNodes: {},
                parent: nodeId,
              };
              nestedChildren.push(childId);
            }
          }
        });
      }

      // Handle TwoColumn — reconstruct linked nodes
      if (typeName === 'TwoColumn') {
        const leftId = generateNodeId();
        const rightId = generateNodeId();
        nodes[leftId] = {
          type: { resolvedName: 'Container' },
          isCanvas: true,
          props: { background: '#f9f9f9', padding: 10 },
          displayName: 'Container',
          custom: {},
          hidden: false,
          nodes: [],
          linkedNodes: {},
          parent: nodeId,
        };
        nodes[rightId] = {
          type: { resolvedName: 'Container' },
          isCanvas: true,
          props: { background: '#f9f9f9', padding: 10 },
          displayName: 'Container',
          custom: {},
          hidden: false,
          nodes: [],
          linkedNodes: {},
          parent: nodeId,
        };
        nestedLinkedNodes['left-column'] = leftId;
        nestedLinkedNodes['right-column'] = rightId;
      }

      nodes[nodeId] = {
        type: { resolvedName: typeName },
        isCanvas: isCanvas,
        props: props,
        displayName: typeName,
        custom: {},
        hidden: false,
        nodes: nestedChildren,
        linkedNodes: nestedLinkedNodes,
        parent: 'ROOT',
      };
      childNodeIds.push(nodeId);
    }
  }

  // Create ROOT Paper node
  nodes['ROOT'] = {
    type: { resolvedName: 'Paper' },
    isCanvas: true,
    props: { background: '#ffffff' },
    displayName: 'Paper',
    custom: {},
    hidden: false,
    nodes: childNodeIds,
    linkedNodes: {},
  };

  return JSON.stringify(nodes);
};
