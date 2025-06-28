const regex = /\/(?<signature>(?:product|element)(?:\.[^/]+)*)\/(?<id>\d+)(?:_[^/.]+)?\.(?<extension>jpg|png)$/;

export function parseIcon(url: string | undefined): { id: number, signature: string, extension: string } | undefined {
  if (typeof url !== 'string') {
    return;
  }

  const match = url.match(regex)?.groups;

  return match
    ? { id: Number(match.id), signature: match.signature, extension: match.extension }
    : undefined;
}
