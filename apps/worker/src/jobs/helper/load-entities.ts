import type { EndpointType, KnownBulkExpandedEndpoint, KnownLocalizedEndpoint } from '@brickninjaapi/types/endpoints';
import type { SchemaVersion } from './schema';
import type { LocalizedObject } from './types';

import { fetchApi } from './fetch-api';
import { groupLocalizedEntitiesById } from './group-by-id';

type ModelOfBulkEndpoint<E extends KnownBulkExpandedEndpoint> = EndpointType<`${E}?ids=$`, SchemaVersion> extends Array<infer T> ? T : never;

export async function loadLocalizedEntities<Endpoint extends KnownBulkExpandedEndpoint & KnownLocalizedEndpoint>(
  endpoint: Endpoint,
  ids: EndpointType<Endpoint>,
): Promise<Map<EndpointType<Endpoint>[number], LocalizedObject<ModelOfBulkEndpoint<Endpoint>>>> {
  const start = new Date();

  const [en, nl] = await Promise.all([
    // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
    fetchApi(`${endpoint}?ids=${ids.join(',')}`, { language: 'en' }) as Promise<(ModelOfBulkEndpoint<Endpoint> & { id: string | number })[]>,
    // @ts-expect-error TS is not smart enough here (or I'm not smart enough for those deeply nested generics)
    fetchApi(`${endpoint}?ids=${ids.join(',')}`, { language: 'nl' }) as Promise<(ModelOfBulkEndpoint<Endpoint> & { id: string | number })[]>,
  ]);

  console.log(`Fetched ${ids.length} entities in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  // @ts-expect-error TODO: fix types
  return groupLocalizedEntitiesById(en, nl);
}
