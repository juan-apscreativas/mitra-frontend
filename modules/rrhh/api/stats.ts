import { httpClient } from '@/lib/http-client'
import type { RrhhStats, RrhhTab } from '../types'

export const rrhhStatsKeys = {
  all: ['rrhh', 'stats'] as const,
  byTab: (tab: RrhhTab) => [...rrhhStatsKeys.all, tab] as const,
}

export async function getRrhhStats(tab: RrhhTab): Promise<{ data: RrhhStats }> {
  return httpClient.get('/rrhh/stats', { params: { tab } })
}
