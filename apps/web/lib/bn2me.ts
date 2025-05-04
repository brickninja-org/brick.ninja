import 'server-only';

import { Bn2MeClient } from '@bn2me/client';

export const client_id = process.env.BN2ME_CLIENT_ID!;
const client_secret = process.env.BN2ME_CLIENT_SECRET;
const url = process.env.BN2ME_URL;

export const bn2me = new Bn2MeClient({ client_id, client_secret }, { url });
