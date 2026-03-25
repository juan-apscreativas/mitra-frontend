import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { areaKeys, getAreas, getArea, createArea, updateArea } from '../api/areas'
import type { AreaListParams, CreateAreaInput, UpdateAreaInput } from '../types'

export function useAreas(params?: AreaListParams) {
  return useQuery({
    queryKey: areaKeys.list(params),
    queryFn: () => getAreas(params),
  })
}

export function useArea(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: areaKeys.detail(id),
    queryFn: () => getArea(id),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAreaInput) => createArea(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areaKeys.lists() }),
  })
}

export function useUpdateArea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaInput }) => updateArea(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areaKeys.all }),
  })
}
