import { useQuery } from '@tanstack/react-query'
import { rrhhStatsKeys, getRrhhStats } from '../api/stats'
import type { RrhhTab } from '../types'

export function useRrhhStats(tab: RrhhTab) {
  return useQuery({
    queryKey: rrhhStatsKeys.byTab(tab),
    queryFn: () => getRrhhStats(tab),
  })
}
