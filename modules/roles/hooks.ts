import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  roleKeys,
  permissionKeys,
  effectiveAccessKeys,
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  duplicateRole,
  syncRolePermissions,
  getPermissions,
  syncUserDirectPermissions,
  getEffectiveAccess,
} from './api'
import type { RoleListParams, CreateRoleInput, UpdateRoleInput, UserPermissionEntry } from './types'

export function useRoles(params?: RoleListParams) {
  return useQuery({ queryKey: roleKeys.list(params), queryFn: () => getRoles(params) })
}

export function useRole(id: string, options?: { enabled?: boolean }) {
  return useQuery({ queryKey: roleKeys.detail(id), queryFn: () => getRole(id), enabled: options?.enabled ?? true })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoleInput) => createRole(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.lists() }),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) => updateRole(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all }),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.lists() }),
  })
}

export function useDuplicateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => duplicateRole(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.lists() }),
  })
}

export function useSyncRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: number[] }) =>
      syncRolePermissions(roleId, permissions),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all }),
  })
}

export function usePermissionsList() {
  return useQuery({ queryKey: permissionKeys.all, queryFn: getPermissions })
}

export function useSyncUserDirectPermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, permissions }: { userId: string; permissions: UserPermissionEntry[] }) =>
      syncUserDirectPermissions(userId, permissions),
    onSuccess: (_, { userId }) =>
      qc.invalidateQueries({ queryKey: effectiveAccessKeys.user(userId) }),
  })
}

export function useEffectiveAccess(userId: string) {
  return useQuery({
    queryKey: effectiveAccessKeys.user(userId),
    queryFn: () => getEffectiveAccess(userId),
  })
}
