export function getReturnToUrl(returnTo?: string) {
  if(returnTo && returnTo.startsWith('/')) {
    // make sure the return to cookie does not start with a `//`, this could be an 'protocol relative' absolute url
    if(returnTo === '/' || returnTo[1] !== '/') {
      return returnTo;
    }
  }

  return '/profile';
}
