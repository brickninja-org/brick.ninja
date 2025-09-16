import type { Metadata, ResolvingMetadata } from 'next';
import type { TemplateString } from 'next/dist/lib/metadata/types/metadata-types';
import type { Language } from '@brickninja-org/database';
import type { LayoutProps, PageProps } from './next';

import { getAlternateUrls, getCurrentUrl } from './url';
import { getLanguage } from './translate';

interface CreateMetadataContext {
  language: Language,
}

type CreateMetadataCallback<T> = (props: T, context: CreateMetadataContext) => Promise<Meta> | Meta;

type GenerateMetadata<T> = (props: T, parent: ResolvingMetadata) => Promise<Metadata>;

export function createMetadata<Props extends PageProps | LayoutProps>(
  getMeta: CreateMetadataCallback<Props> | Meta
): GenerateMetadata<Props> {
  return async (props) => {
    const language = await getLanguage();

    // get meta from callback or object
    const meta = typeof getMeta === 'function'
      ? await getMeta(props, { language })
      : getMeta;

    // generate alternate urls
    // TODO: require `meta.url` to be set for all pages to remove fallback to dynamic `getCurrentUrl`
    const url = await getCurrentUrl();
    const alternates = getAlternateUrls(meta.url ?? url.pathname, language);

    // get metadata from parent (e.g. layout)
    // const parentMeta = await parent;

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates,
      robots: meta.robots,
    };
  };
}

type Meta = {
  title: string | TemplateString,
  ogTitle?: string,
  description?: string,
  keywords?: string[],
  url?: string,
  robots?: Metadata['robots'],
};
