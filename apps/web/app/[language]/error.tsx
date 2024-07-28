"use client";

import { HeroLayout } from "@/components/layout/hero-layout";
import { Headline } from "@brickninja-org/ui/components/headline";

export default function Error({error, reset}: {error: Error; reset: () => void;}) {
  return (
    <HeroLayout hero={<Headline id="error">Something went wrong!</Headline>}>
      <pre style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}}>
        {error.stack && (process.env.NODE_ENV === "production" ? window.btoa(error.stack) : error.stack)}
      </pre>
    </HeroLayout>
  )
}