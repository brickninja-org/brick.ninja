import { db } from '../../db';
import { Job } from '../job';

// If color id is 14, 15 delete this from the database
export const DeleteEntitiesJob: Job = {
  run: async (data: { ids: number[] }) => {
    if (!data || !Array.isArray(data.ids) || data.ids.length === 0) {
      return;
    }
    
    // Ensure the ids are valid numbers
    if (data.ids.some((id) => typeof id !== 'number' || id <= 0)) {
      throw new Error('Invalid color IDs provided for deletion.');
    }

    // Check if if the ids exists in the database
    const existingColors = await db.color.findMany({
      where: {
        id: { in: data.ids },
      },
    });
    if (existingColors.length === 0) {
      return 'No colors found for the provided IDs.';
    }
    
    const idsToDelete = existingColors.map((color) => color.id);

    // delete all colors with the specified ids
    const deleted = await db.color.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });

    return `Deleted ${deleted.count} colors with IDs: ${idsToDelete.join(', ')}.`;
  }
};