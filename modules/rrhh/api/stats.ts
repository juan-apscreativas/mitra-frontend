import { httpClient } from '@/lib/http-client'
import type { RrhhStats, RrhhTab } from '../types'

export const rrhhStatsKeys = {
  all: ['rrhh', 'stats'] as const,
  byTab: (tab: RrhhTab, filters?: Record<string, string>) =>
    [...rrhhStatsKeys.all, tab, filters ?? {}] as const,
}

export async function getRrhhStats(
  tab: RrhhTab,
  filters?: Record<string, string>,
): Promise<{ data: RrhhStats }> {
  const params: Record<string, string> = { tab }
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[`filter[${key}]`] = value
    })
  }
  return httpClient.get('/rrhh/stats', { params })
}
