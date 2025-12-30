import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CatalogOverride } from '../lib/catalogStorage';
import { clearCatalogOverrides, mergeCatalog, readCatalogOverrides, writeCatalogOverrides } from '../lib/catalogStorage';
import { shopProducts } from '../data/shopProducts';

export function useCatalog() {
  const [overrides, setOverrides] = useState<CatalogOverride[]>([]);
  const [serverAvailable, setServerAvailable] = useState(false);

  useEffect(() => {
    // Start with local cache for instant UI
    setOverrides(readCatalogOverrides());

    // Then try server-backed overrides (if deployed with Vercel functions)
    (async () => {
      try {
        const res = await fetch('/api/catalog', { method: 'GET', credentials: 'include' });
        if (!res.ok) return;
        const data = (await res.json()) as { overrides?: CatalogOverride[] };
        if (Array.isArray(data?.overrides)) {
          setOverrides(data.overrides);
          setServerAvailable(true);
        }
      } catch {
        // ignore (stay on local)
      }
    })();
  }, []);

  useEffect(() => {
    writeCatalogOverrides(overrides);
  }, [overrides]);

  useEffect(() => {
    if (!serverAvailable) return;
    const handle = window.setTimeout(() => {
      (async () => {
        try {
          const res = await fetch('/api/catalog', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ overrides }),
          });

          if (!res.ok && res.status !== 401) {
            setServerAvailable(false);
          }
        } catch {
          // ignore; localStorage remains the fallback
        }
      })();
    }, 400);

    return () => window.clearTimeout(handle);
  }, [overrides, serverAvailable]);

  const catalog = useMemo(() => {
    return mergeCatalog(shopProducts, overrides);
  }, [overrides]);

  const updateOverride = useCallback((id: string, next: Partial<CatalogOverride>) => {
    setOverrides((prev) => {
      const existing = prev.find((o) => o.id === id);
      const merged: CatalogOverride = { id, ...(existing ?? {}), ...next };
      const without = prev.filter((o) => o.id !== id);
      return [...without, merged];
    });
  }, []);

  const reset = useCallback(() => {
    clearCatalogOverrides();
    setOverrides([]);
  }, []);

  const refresh = useCallback(() => {
    setOverrides(readCatalogOverrides());
  }, []);

  return { catalog, overrides, updateOverride, reset, refresh };
}
