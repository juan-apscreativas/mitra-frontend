import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  userKeys,
  getUsers,
  getUser,
  createUser,
  updateUser,
  forceChangePassword,
  uploadAvatar,
  deleteAvatar,
  syncUserRoles,
} from './api'
import type { UserListParams, CreateUserInput, UpdateUserInput } from './types'

export function useUsers(params?: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  })
}

export function useUser(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useForceChangePassword() {
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: { password: string; password_confirmation: string }
    }) => forceChangePassword(userId, data),
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) => uploadAvatar(userId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => deleteAvatar(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useSyncUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: number[] }) =>
      syncUserRoles(userId, roles),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}
