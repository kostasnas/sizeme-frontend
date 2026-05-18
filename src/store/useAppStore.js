import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // Auth
  user:      null,
  authReady: false,          // true once Supabase has resolved session (null or user)
  setUser:      (user)      => set({ user }),
  setAuthReady: (authReady) => set({ authReady }),

  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Scans
  scans:    [],
  addScan:  (scan)  => set(s => ({ scans: [scan, ...s.scans] })),
  setScans: (scans) => set({ scans }),

  // Pro
  isPro:    false,
  setIsPro: (isPro) => set({ isPro }),

  // Free scan counter
  freeScansUsed:      0,
  FREE_SCAN_LIMIT:    3,
  incrementFreeScans: () => set(s => ({ freeScansUsed: s.freeScansUsed + 1 })),
  canScan: () => {
    const { isPro, freeScansUsed, FREE_SCAN_LIMIT } = get()
    return isPro || freeScansUsed < FREE_SCAN_LIMIT
  },
}))
