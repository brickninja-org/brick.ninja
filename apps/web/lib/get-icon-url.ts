import type { EntityIconType } from '@/components/entity/EntityIcon';
import type { Icon } from '@brickninja-org/database';

export type FixedIconSize = 16 | 32 | 64;
export type IconSize = FixedIconSize | (number & {});

export function getIconUrl({ id, signature }: Pick<Icon, 'id'> & Partial<Pick<Icon, 'signature'>>, size: FixedIconSize, type?: EntityIconType) {
  return signature && type === 'product'
    ? `https://www.lego.com/cdn/cs/set/assets/${signature}/${id}.png?format=webply&fit=crop&quality=80&width=${size}&height=${size}`
    : `https://www.lego.com/cdn/product-assets/element.img.photoreal.192x192/${id}.jpg`;
}

const iconSizes: FixedIconSize[] = [16, 32, 64];

export function getIconSize(size: IconSize): FixedIconSize {
  return iconSizes.find((iconSize) => iconSize >= size) || 64;
}
