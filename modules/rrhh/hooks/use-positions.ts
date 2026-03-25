import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { positionKeys, getPositions, getPosition, createPosition, updatePosition } from '../api/positions'
import type { PositionListParams, CreatePositionInput, UpdatePositionInput } from '../types'

export function usePositions(params?: PositionListParams) {
  return useQuery({
    queryKey: positionKeys.list(params),
    queryFn: () => getPositions(params),
  })
}

export function usePosition(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: positionKeys.detail(id),
    queryFn: () => getPosition(id),
    enabled: options?.enabled ?? true,
  })
}

export function useCreatePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePositionInput) => createPosition(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: positionKeys.lists() }),
  })
}

export function useUpdatePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePositionInput }) => updatePosition(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: positionKeys.all }),
  })
}
