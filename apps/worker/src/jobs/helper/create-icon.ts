import { db } from '../../db';

export async function createIcon(url: string | undefined) {
  // https://www.lego.com/cdn/product-assets/product.bi.core.img/6554691.png
  // get signature and id from url
  const icon = url?.match(/\/(?<signature>[^/]*)\/(?<id>[^/]*)\.(jpg|png)$/)?.groups as { signature: string, id: number } | undefined;

  if (icon && icon.id) {
    icon.id = Number(icon.id);

    if (Number.isNaN(icon.id)) {
      console.log(`Icon id is not a number: ${icon.id}`);
    } else {
      await db.icon.upsert({
        create: icon,
        update: {},
        where: { id: icon.id },
      });
    }
  }

  return icon?.id;
}
