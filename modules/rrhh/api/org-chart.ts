import { httpClient } from '@/lib/http-client'
import type { OrgChartNode } from '../types'

export const orgChartKeys = {
  all: ['rrhh', 'org-chart'] as const,
}

export async function getOrgChart(): Promise<{ data: OrgChartNode[] }> {
  return httpClient.get('/rrhh/org-chart')
}
