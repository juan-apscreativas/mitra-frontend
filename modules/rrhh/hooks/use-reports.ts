import { useQuery } from '@tanstack/react-query'
import { reportsKeys, getReportsData } from '../api/reports'
import type { ReportsFilterParams } from '../types'

export function useReportsData(params: ReportsFilterParams) {
  return useQuery({
    queryKey: reportsKeys.filtered(params),
    queryFn: () => getReportsData(params),
  })
}
