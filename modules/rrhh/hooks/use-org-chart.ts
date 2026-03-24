import { useQuery } from '@tanstack/react-query'
import { orgChartKeys, getOrgChart } from '../api/org-chart'

export function useOrgChart() {
  return useQuery({
    queryKey: orgChartKeys.all,
    queryFn: getOrgChart,
  })
}
