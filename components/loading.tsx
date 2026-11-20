/** Suspense placeholder for routes that read URL params (Cache Components). Pages are prerendered, so it rarely shows. */
export function RouteLoading() {
  return <div aria-busy="true" aria-label="Načítám" className="min-h-dvh" />;
}
