import { dbDebug } from "../../db";
import { fetchApi } from "../helper/fetch-api";
import { Job } from "../job";

export const ItemsCheck: Job = {
  run: async () => {
    dbDebug.log = true;

    // skip if any follow up jobs are still queued

    // get item ids from the API
    const ids = await fetchApi('/v3.asmx/getSets', { accessToken: process.env.BRICKSET_API_KEY! });
  }
};
