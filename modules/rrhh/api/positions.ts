import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type { Position, PositionListParams, CreatePositionInput, UpdatePositionInput } from '../types'

export const positionKeys = {
  all: ['rrhh', 'positions'] as const,
  lists: () => [...positionKeys.all, 'list'] as const,
  list: (params?: PositionListParams) => [...positionKeys.lists(), params] as const,
  details: () => [...positionKeys.all, 'detail'] as const,
  detail: (id: string) => [...positionKeys.details(), id] as const,
}

export async function getPositions(params?: PositionListParams): Promise<PaginatedResponse<Position>> {
  return httpClient.get('/rrhh/positions', { params: params as Record<string, unknown> })
}

export async function getPosition(id: string): Promise<{ data: Position }> {
  return httpClient.get(`/rrhh/positions/${id}`)
}

export async function createPosition(data: CreatePositionInput): Promise<{ data: Position }> {
  return httpClient.post('/rrhh/positions', data)
}

export async function updatePosition(id: string, data: UpdatePositionInput): Promise<{ data: Position }> {
  return httpClient.put(`/rrhh/positions/${id}`, data)
}
