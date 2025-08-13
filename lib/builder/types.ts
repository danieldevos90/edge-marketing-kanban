export type BlockBase = { id: string; type: string };

export type BannerBlock = BlockBase & {
  type: 'banner';
  title: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ProductRef = { id: string; title: string; imageUrl?: string | null; price?: number };

export type ProductGridBlock = BlockBase & {
  type: 'productGrid';
  products: ProductRef[];
};

export type TextBlock = BlockBase & {
  type: 'text';
  html: string;
};

export type ButtonBlock = BlockBase & {
  type: 'button';
  label: string;
  href: string;
};

export type BuilderBlock = BannerBlock | ProductGridBlock | TextBlock | ButtonBlock;

export type BuilderDocument = {
  subject?: string;
  blocks: BuilderBlock[];
};
