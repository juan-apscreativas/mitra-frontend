import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type { Area, AreaListParams, CreateAreaInput, UpdateAreaInput } from '../types'

export const areaKeys = {
  all: ['rrhh', 'areas'] as const,
  lists: () => [...areaKeys.all, 'list'] as const,
  list: (params?: AreaListParams) => [...areaKeys.lists(), params] as const,
  details: () => [...areaKeys.all, 'detail'] as const,
  detail: (id: string) => [...areaKeys.details(), id] as const,
}

export async function getAreas(params?: AreaListParams): Promise<PaginatedResponse<Area>> {
  return httpClient.get('/rrhh/areas', { params: params as Record<string, unknown> })
}

export async function getArea(id: string): Promise<{ data: Area }> {
  return httpClient.get(`/rrhh/areas/${id}`)
}

export async function createArea(data: CreateAreaInput): Promise<{ data: Area }> {
  return httpClient.post('/rrhh/areas', data)
}

export async function updateArea(id: string, data: UpdateAreaInput): Promise<{ data: Area }> {
  return httpClient.put(`/rrhh/areas/${id}`, data)
}
