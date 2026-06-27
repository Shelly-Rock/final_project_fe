"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PersistedState<T> {
  _hasHydrated: boolean;
  data: T[];
  lastUpdated: string;
  version: number;
  setHasHydrated: (state: boolean) => void;
}

export interface MockDataStoreOptions<T> {
  storageKey: string;
  initialData: T[];
  idField?: keyof T; // field to use as unique ID (default: "id")
}

/**
 * Creates a Zustand store with localStorage persistence for mock data.
 * Each page gets its own store instance by calling this factory function.
 *
 * Usage:
 *   const useThesesStore = createMockDataStore({ storageKey: "theses", initialData: MOCK_THESES });
 *   const theses = useThesesStore((s) => s.data);
 *   useThesesStore.getState().add(newThesis);
 */
export function createMockDataStore<T extends Record<string, unknown>>(
  options: MockDataStoreOptions<T>
) {
  const { storageKey, initialData, idField = "id" as keyof T } = options;

  return create<PersistedState<T>>()(
    persist(
      (set) => ({
        _hasHydrated: false,
        data: initialData,
        lastUpdated: new Date().toISOString(),
        version: 1,

        setHasHydrated: (state) => set({ _hasHydrated: state }),

        reset: () =>
          set({
            data: initialData,
            lastUpdated: new Date().toISOString(),
          }),

        add: (item: T) =>
          set((state) => ({
            data: [...state.data, item],
            lastUpdated: new Date().toISOString(),
          })),

        update: (id: string, updates: Partial<T>) =>
          set((state) => ({
            data: state.data.map((item) =>
              String(item[idField]) === id ? { ...item, ...updates } : item
            ),
            lastUpdated: new Date().toISOString(),
          })),

        remove: (id: string) =>
          set((state) => ({
            data: state.data.filter((item) => String(item[idField]) !== id),
            lastUpdated: new Date().toISOString(),
          })),

        upsert: (item: T) =>
          set((state) => {
            const exists = state.data.some(
              (d) => String(d[idField]) === String(item[idField])
            );
            return {
              data: exists
                ? state.data.map((d) =>
                    String(d[idField]) === String(item[idField]) ? item : d
                  )
                : [...state.data, item],
              lastUpdated: new Date().toISOString(),
            };
          }),
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  );
}
