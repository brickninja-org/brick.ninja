import type { HTMLProps, ReactElement, ReactNode } from 'react';
import type { TranslationSubset } from '@/lib/translate';
import type { translations as itemTypeTranslations, TypeTranslation } from '@/components/item/ItemType.translations';
import type { SubType, Type } from '@/components/item/ItemType.types';
import type { ApiSearchResponse } from 'app/[language]/api/search/route';

import { useJsonFetch, useStaleJsonResponse } from '@/hooks/use-fetch';
import { getLinkProperties } from '@/lib/link-properties';
import { localizedName } from '@/lib/localized-name';

import { useLanguage } from '@/components/i18n/context';
import { ItemLinkTooltip } from '@/components/item/ItemLinkTooltip';
import { ItemType } from '@/components/item/ItemType';
import { Tooltip } from '@/components/tooltip/Tooltip';
import { EntityIcon } from '../entity/EntityIcon';
import { ProductLinkTooltip } from '../product/ProductLinkTooltip';

export interface SearchResults<Id extends string> {
  id: Id;
  results: SearchResult[];
  loading: boolean;
}

export interface SearchResult {
  href: string;
  title: ReactNode;
  icon?: ReactNode;
  subtitle?: ReactNode;
  render?: (link: ReactElement<HTMLProps<HTMLElement>>) => ReactNode;
}

export function useSearchApiResults(searchValue: string, translations: TranslationSubset<typeof itemTypeTranslations.short[0]>) {
  const fetchResponse = useJsonFetch<ApiSearchResponse>(`/api/search?q=${encodeURIComponent(searchValue)}`);
  const response = useStaleJsonResponse(fetchResponse);
  const language = useLanguage();

  const items = response.loading ? [] : response.data.items.map<SearchResult>((item) => ({
    title: localizedName(item, language),
    icon: item.icon && <EntityIcon icon={item.icon} size={32}/>,
    subtitle: <>{item.id} ▪ <ItemType type={item.type as Type} subtype={item.subtype as SubType<Type>} translations={translations as unknown as Record<TypeTranslation<Type, SubType<Type>>, string>}/></>,
    href: `/item/${item.id}`,
    render: (link) => <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)}/>} key={link.key}>{link}</Tooltip>
  }));

  const products = response.loading ? [] : response.data.products.map<SearchResult>((product) => ({
    title: localizedName(product, language),
    icon: product.icon && <EntityIcon icon={product.icon} size={32}/>,
    subtitle: (
      <>
        {product.id}
        {product.categories && product.categories.length > 0 && (<> ▪ {localizedName(product.categories[0], language)}</>)}
      </>
    ),
    href: `/product/${product.id}`,
    render: (link) => <Tooltip content={<ProductLinkTooltip product={getLinkProperties(product)}/>} key={link.key}>{link}</Tooltip>
  }));

  const categories = response.loading ? [] : response.data.productCategories.map<SearchResult>((category) => ({
    title: localizedName(category, language),
    href: `/products/category/${category.id}`,
    subtitle: 'Category',
  }));

  const results = <Id extends string>(id: Id, results: SearchResult[]): SearchResults<Id> => ({ id, results, loading: fetchResponse.loading });

  return [
    results('items', items),
    results('products', products),
    results('product.categories', categories),
  ];
}

type Page = { href: string, title: string };
const pages: Page[] = [
  { href: '/login', title: 'Login' },
  { href: '/status', title: 'Status' },
  { href: '/status/jobs', title: 'Job Status' },
  { href: '/status/api', title: 'API Status' },
  { href: '/status/database', title: 'Database Status' },
  { href: '/about', title: 'About' },
  { href: '//legal/legal-notice', title: 'Legal Notice' },
  { href: '/legal/privacy-policy', title: 'Privacy Policy' },
  { href: '/review', title: 'Review Queues' },

  { href: '/item', title: 'Items' },
  { href: '/products', title: 'Products' },

  { href: '/dev', title: 'Developer' },
  { href: '/dev/api', title: 'Developer / API' },
  { href: '/dev#applications', title: 'Developer / Your Applications' },

  { href: '/build', title: 'Builds' },
  { href: '/color', title: 'Colors' },

  { href: '/item/random', title: 'Random Item' },
  { href: '/item/empty-containers', title: 'Empty containers' },
];

export function usePageResults(searchValue: string): SearchResults<'pages'> {
  const results = pages
    .filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((_, index) => index < 5)
    .map(({ title, href }) => ({ title, href }));

  return { id: 'pages', results, loading: false };
}
