'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Reactive localStorage hook. SSR-safe: starts from `initialValue` on the
 * server and first client paint, then hydrates from storage after mount so
 * markup matches and we avoid hydration mismatches. Also syncs across tabs.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) setValue(JSON.parse(raw) as T)
    } catch {
      // ignore malformed / unavailable storage
    }
    setHydrated(true)
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // storage might be full / disabled — fail silently
        }
        return resolved
      })
    },
    [key],
  )

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key) return
      try {
        setValue(e.newValue === null ? initialValue : (JSON.parse(e.newValue) as T))
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { value, set, hydrated } as const
}
