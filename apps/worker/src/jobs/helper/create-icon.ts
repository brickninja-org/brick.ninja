import { db } from '../../db';

export async function createIcon(url: string | undefined) {
  // https://www.lego.com/cdn/product-assets/product.bi.core.img/6554691.png || https://www.lego.com/cdn/product-assets/product.img.pri/10280_Prod.jpg
  // get signature and id(numeric) and extension (jpg or png) from url
  const icon = url?.match(/\/(?<signature>[^/]*)\/(?<id>\d+)\.(?<extension>jpg|png)$/) as { signature: string, id: number, extension: 'jpg' | 'png' } | undefined;

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
