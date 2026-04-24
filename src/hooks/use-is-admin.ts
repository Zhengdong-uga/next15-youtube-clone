"use client";

import { useEffect, useState } from "react";

interface AdminMe {
  isAdmin: boolean;
  userId: string | null;
}

/**
 * Client-side hook that reports whether the current viewer is the admin/owner.
 * Returns { isAdmin, ownerId, isLoaded }.
 */
export const useIsAdmin = () => {
  const [data, setData] = useState<AdminMe | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((json: AdminMe) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData({ isAdmin: false, userId: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isAdmin: data?.isAdmin ?? false,
    ownerId: data?.userId ?? null,
    isLoaded: data !== null,
  };
};
