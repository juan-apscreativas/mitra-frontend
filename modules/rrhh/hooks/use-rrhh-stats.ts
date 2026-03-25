import { useQuery } from '@tanstack/react-query'
import { rrhhStatsKeys, getRrhhStats } from '../api/stats'
import type { RrhhTab } from '../types'

export function useRrhhStats(tab: RrhhTab, filters?: Record<string, string>) {
  return useQuery({
    queryKey: rrhhStatsKeys.byTab(tab, filters),
    queryFn: () => getRrhhStats(tab, filters),
  })
}
