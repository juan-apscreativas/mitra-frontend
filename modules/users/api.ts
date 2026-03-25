import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type { User, UserListParams, CreateUserInput, UpdateUserInput } from './types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export async function getUsers(params?: UserListParams): Promise<PaginatedResponse<User>> {
  return httpClient.get('/users', { params: params as Record<string, unknown> })
}

export async function getUser(id: string): Promise<{ data: User }> {
  return httpClient.get(`/users/${id}`)
}

export async function createUser(data: CreateUserInput): Promise<{ data: User }> {
  return httpClient.post('/users', data)
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<{ data: User }> {
  return httpClient.put(`/users/${id}`, data)
}

export async function forceChangePassword(
  userId: string,
  data: { password: string; password_confirmation: string }
): Promise<void> {
  return httpClient.put(`/users/${userId}/password`, data)
}

export async function uploadAvatar(userId: string, file: File): Promise<{ data: User }> {
  const formData = new FormData()
  formData.append('avatar', file)
  return httpClient.post(`/users/${userId}/avatar`, formData)
}

export async function deleteAvatar(userId: string): Promise<{ data: User }> {
  return httpClient.delete(`/users/${userId}/avatar`)
}

export async function syncUserRoles(userId: string, roles: number[]): Promise<void> {
  return httpClient.put(`/users/${userId}/roles`, { roles })
}
