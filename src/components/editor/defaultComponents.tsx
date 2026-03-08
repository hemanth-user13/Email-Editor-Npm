import React from "react";
import { Element } from "@craftjs/core";
import {
  PanelTop,
  PanelBottom,
  LayoutTemplate,
  Columns,
  ArrowUpDown,
  Minus,
  Type,
  Image,
  MousePointer2,
  PlayCircle,
  List,
  Share2,
  Timer,
  Tag,
  Quote,
  Variable,
  Table,
} from "lucide-react";

import { Container } from "./components/Container";
import { EmailHeader } from "./components/EmailHeader";
import { EmailFooter } from "./components/EmailFooter";
import { EmailButton } from "./components/EmailButton";
import { TextBlock } from "./components/TextBlock";
import { ImageBlock } from "./components/ImageBlock";
import { Divider } from "./components/Divider";
import { InvoiceTable } from "./components/InvoiceTable";
import { Spacer } from "./components/Spacer";
import { SocialLinks } from "./components/SocialLinks";
// import { TwoColumn } from './components/TwoColumn';
import { RawHtml } from "./components/RawHtml";
import { Countdown } from "./components/Countdown";
import { PromoCode } from "./components/PromoCode";
import { Testimonial } from "./components/Testimonial";
import { VideoPlaceholder } from "./components/VideoPlaceholder";
import { VariableText } from "./components/VariableText";
import { IconList } from "./components/IconList";

import type { ComponentRegistry } from "./types";

export const DEFAULT_COMPONENTS: ComponentRegistry = {
  EmailHeader: {
    component: EmailHeader,
    label: "Header",
    description: "Email header with logo",
    icon: PanelTop,
    category: "Layout",
  },
  EmailFooter: {
    component: EmailFooter,
    label: "Footer",
    description: "Contact info & copyright",
    icon: PanelBottom,
    category: "Layout",
  },
  Container: {
    component: Container,
    label: "Container",
    description: "Group elements together",
    icon: LayoutTemplate,
    category: "Layout",
    createElement: () => <Element is={Container} canvas />,
  },

  Spacer: {
    component: Spacer,
    label: "Spacer",
    description: "Add vertical space",
    icon: ArrowUpDown,
    category: "Layout",
  },
  Divider: {
    component: Divider,
    label: "Divider",
    description: "Horizontal line separator",
    icon: Minus,
    category: "Layout",
  },
  TextBlock: {
    component: TextBlock,
    label: "Text Block",
    description: "Paragraph or heading",
    icon: Type,
    category: "Content",
  },
  ImageBlock: {
    component: ImageBlock,
    label: "Image",
    description: "Add photos or graphics",
    icon: Image,
    category: "Content",
  },
  EmailButton: {
    component: EmailButton,
    label: "Button",
    description: "Call-to-action button",
    icon: MousePointer2,
    category: "Content",
  },
  VideoPlaceholder: {
    component: VideoPlaceholder,
    label: "Video",
    description: "Video thumbnail with play",
    icon: PlayCircle,
    category: "Content",
  },
  IconList: {
    component: IconList,
    label: "Icon List",
    description: "List with icons",
    icon: List,
    category: "Content",
  },
  SocialLinks: {
    component: SocialLinks,
    label: "Social Links",
    description: "Social media icons",
    icon: Share2,
    category: "Content",
  },
  Countdown: {
    component: Countdown,
    label: "Countdown",
    description: "Urgency timer display",
    icon: Timer,
    category: "Marketing",
  },
  PromoCode: {
    component: PromoCode,
    label: "Promo Code",
    description: "Discount code box",
    icon: Tag,
    category: "Marketing",
  },
  Testimonial: {
    component: Testimonial,
    label: "Testimonial",
    description: "Customer review quote",
    icon: Quote,
    category: "Marketing",
  },
  VariableText: {
    component: VariableText,
    label: "Variable Text",
    description: "Personalized content",
    icon: Variable,
    category: "Dynamic",
  },
  InvoiceTable: {
    component: InvoiceTable,
    label: "Invoice Table",
    description: "Itemized billing table",
    icon: Table,
    category: "Invoice",
  },
};

/** Helper to get the Craft.js resolver map from a ComponentRegistry */
export const buildResolver = (
  registry: ComponentRegistry,
): Record<string, React.ComponentType<any>> => {
  const resolver: Record<string, React.ComponentType<any>> = {};
  for (const [name, config] of Object.entries(registry)) {
    resolver[name] = config.component;
  }
  return resolver;
};

/** Helper to get unique sorted categories from a ComponentRegistry */
export const getCategories = (registry: ComponentRegistry): string[] => {
  const cats = new Set<string>();
  for (const config of Object.values(registry)) {
    if (config.category) cats.add(config.category);
  }
  return Array.from(cats);
};
