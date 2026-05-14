import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  profile: null,
  setProfile: (profile) => set({ profile }),
  scans: [],
  addScan: (scan) => set(s => ({ scans: [scan, ...s.scans] })),
  setScans: (scans) => set({ scans }),
  isPro: false,
  setIsPro: (isPro) => set({ isPro }),
  freeScansUsed: 0,
  incrementFreeScans: () => set(s => ({ freeScansUsed: s.freeScansUsed + 1 })),
  FREE_SCAN_LIMIT: 3,
  canScan: () => {
    const { isPro, freeScansUsed, FREE_SCAN_LIMIT } = get()
    return isPro || freeScansUsed < FREE_SCAN_LIMIT
  },
}))
