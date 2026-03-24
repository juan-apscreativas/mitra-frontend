import { httpClient } from '@/lib/http-client'
import type { ReportsData, ReportsFilterParams } from '../types'

export const reportsKeys = {
  all: ['rrhh', 'reports'] as const,
  filtered: (params: ReportsFilterParams) => [...reportsKeys.all, params] as const,
}

export async function getReportsData(params: ReportsFilterParams): Promise<{ data: ReportsData }> {
  return httpClient.get('/rrhh/reports', { params: { ...params } })
}
