import {BnMeClient} from "@bn2me/client";

const client_id = process.env.BNME_CLIENT_ID!;
const client_secret = process.env.BNME_CLIENT_SECRET;
const url = process.env.BNME_URL;

export const bn2me = new BnMeClient({client_id, client_secret}, {url});
