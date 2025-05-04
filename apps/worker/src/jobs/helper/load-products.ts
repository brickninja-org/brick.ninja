import data from '../../data/products.json';
import { groupLocalizedEntitiesById } from './group-by-id';

export type Product = typeof data.products[0];

export async function loadProducts(ids: number[]) {
  const start = new Date();

  const [en, nl] = await Promise.all([
    data.products.filter((product) => ids.includes(product.id)).map(normalizeProduct),
    data.products.filter((product) => ids.includes(product.id)).map(normalizeProduct),
    /*
    fetchApi(`/api/v3.asmx/getSets?params={query:'${ids.join(',')}',extendedData:1}`, { apiKey: process.env.BRICKSET_API_KEY! }).then((res) => {
      if (res.status === 'error' || !res.sets) {
        return [];
      }

      return normalizeItems(res.sets);
    }),
    */
  ]);

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(en, nl);
}

function normalizeProduct(product: Product) {
  return product;
}
