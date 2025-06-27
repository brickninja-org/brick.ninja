import type { EntityIconType } from '@/components/entity/EntityIcon';
import type { Icon } from '@brickninja-org/database';

export type FixedIconSize = 16 | 32 | 64;
export type IconSize = FixedIconSize | (number & {});

 
export function getIconUrl({ id, signature, extension }: Pick<Icon, 'id'> & Partial<Pick<Icon, 'signature' | 'extension'>>, size: FixedIconSize, type?: EntityIconType) {
  return signature && extension && (type === 'product' || type === 'element')
    ? `https://www.lego.com/cdn/product-assets/${signature}/${type === 'product' ? `${id}_Prod` : id}.${extension}`
    : `https://www.lego.com/cdn/product-assets/element.img.photoreal.192x192/${id}.jpg`;
}

const iconSizes: FixedIconSize[] = [16, 32, 64];

export function getIconSize(size: IconSize): FixedIconSize {
  return iconSizes.find((iconSize) => iconSize >= size) || 64;
}
