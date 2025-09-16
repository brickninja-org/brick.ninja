import { getAverageColor } from 'fast-average-color-node';
import { db } from '../../db';
import { batch } from '../helper/batch';
import { Job } from '../job';

export const IconColors: Job = {
  run: async () => {
    const icons = await db.icon.findMany({ where: { color: null }, take: 2500 });

    const colors: { id: number, color: string }[] = [];

    for (const iconBatch of batch(icons, 10)) {
      await Promise.all(iconBatch.map(async ({ id, signature }) => {
        const url = `https://www.lego.com/cdn/product-assets/${signature}/${id}.jpg`;

        try {
          const color = await getAverageColor(url);
          colors.push({ id, color: color.hex });
        } catch(e) {
          console.error(`Could not get the average color of icon ${id} (${url}).`);
          console.error(e);
        }
      }));
    }

    await db.$transaction(colors.map(({ id, color }) => db.icon.update({ where: { id }, data: { color }})));

    return `Updated ${colors.length} icon colors.`;
  }
};
