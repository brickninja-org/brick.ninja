import { Bn2MeClient } from '@bn2me/client';

const client_id = process.env.BN2ME_CLIENT_ID!;
const client_secret = process.env.BN2ME_CLIENT_SECRET;
const url = process.env.BNME_URL;

export const bn2me = new Bn2MeClient({ client_id, client_secret }, { url });
