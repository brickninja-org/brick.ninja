import "server-only";

import {headers} from "next/headers";

import type {Language} from "@brickninja-org/database";

export function getLanguage() {
  const language = headers().get("x-bn-lang") as Language

  return language;
}