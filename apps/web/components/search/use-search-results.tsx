import { type HTMLProps, type ReactElement, type ReactNode } from 'react';

import { useJsonFetch, useStaleJsonResponse } from '@/hooks/use-fetch';
import { getLinkProperties } from '@/lib/link-properties';
import { localizedName } from '@/lib/localized-name';

import { useLanguage } from '@/components/i18n/context';
import { ItemLinkTooltip } from '@/components/item/item-link-tooltip';
import { Tooltip } from '@/components/tooltip';

import type { ApiSearchResponse } from 'app/[language]/api/search/route';

export interface SearchResults<Id extends string> {
  id: Id;
  results: SearchResult[];
  loading: boolean;
}

export interface SearchResult {
  href: string;
  title: ReactNode;
  subtitle?: ReactNode;
  render?: (link: ReactElement<HTMLProps<HTMLElement>>) => ReactNode;
}

export function useSearchApiResults(searchValue: string) {
  const fetchResponse = useJsonFetch<ApiSearchResponse>(`/api/search?q=${encodeURIComponent(searchValue)}`);
  const response = useStaleJsonResponse(fetchResponse);
  const language = useLanguage();

  const items = response.loading ? [] : response.data.items.map<SearchResult>((item) => ({
    title: localizedName(item, language),
    subtitle: <>{item.productCode} ▪ {item.type}</>,
    href: `/item/${item.id}`,
    render: (link) => <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)}/>} key={link.key}>{link}</Tooltip>
  }));

  const results = <Id extends string>(id: Id, results: SearchResult[]): SearchResults<Id> => ({ id, results, loading: fetchResponse.loading });

  return [
    results('items', items),
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
  { href: '/about/legal', title: 'Legal Notice' },
  { href: '/about/privacy', title: 'Privacy Policy' },
  { href: '/review', title: 'Review Queues' },

  { href: '/item', title: 'Items' },

  { href: '/dev', title: 'Developer' },
  { href: '/dev/api', title: 'Developer / API' },
  { href: '/dev#applications', title: 'Developer / Your Applications' },

  { href: '/build', title: 'Builds' },
  { href: '/currency', title: 'Currencies' },
  { href: '/color', title: 'Colors' },

  { href: '/item/random', title: 'Random Item' },
  { href: '/item/empty-containers', title: 'Empty containers' },
  { href: '/achievement/random', title: 'Random Achievement' },
  { href: '/achievement/uncategorized', title: 'Uncategorized Achievements' },
];

export function usePageResults(searchValue: string): SearchResults<'pages'> {
  const results = pages
    .filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((_, index) => index < 5)
    .map(({ title, href }) => ({ title, href }));

  return { id: 'pages', results, loading: false };
}
