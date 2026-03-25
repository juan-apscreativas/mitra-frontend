import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  dataScopeRuleKeys,
  scopeableEntityKeys,
  roleDataScopeKeys,
  userDataScopeKeys,
  getDataScopeRules,
  getDataScopeRule,
  createDataScopeRule,
  updateDataScopeRule,
  deleteDataScopeRule,
  previewDataScopeRule,
  getScopeableEntities,
  getRoleDataScopes,
  getUserDataScopes,
  syncRoleDataScopes,
  syncUserDataScopes,
} from './api'
import type {
  DataScopeRuleListParams,
  CreateDataScopeRuleInput,
  UpdateDataScopeRuleInput,
  DataScopeRulePreviewInput,
} from './types'

export function useDataScopeRules(params?: DataScopeRuleListParams) {
  return useQuery({
    queryKey: dataScopeRuleKeys.list(params),
    queryFn: () => getDataScopeRules(params),
  })
}

export function useDataScopeRule(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: dataScopeRuleKeys.detail(id),
    queryFn: () => getDataScopeRule(id),
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useCreateDataScopeRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDataScopeRuleInput) => createDataScopeRule(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: dataScopeRuleKeys.lists() }),
  })
}

export function useUpdateDataScopeRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDataScopeRuleInput }) =>
      updateDataScopeRule(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: dataScopeRuleKeys.lists() })
      qc.invalidateQueries({ queryKey: dataScopeRuleKeys.detail(id) })
    },
  })
}

export function useDeleteDataScopeRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDataScopeRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: dataScopeRuleKeys.lists() }),
  })
}

export function usePreviewDataScope() {
  return useMutation({
    mutationFn: (input: DataScopeRulePreviewInput) => previewDataScopeRule(input),
  })
}

export function useScopeableEntities() {
  return useQuery({
    queryKey: scopeableEntityKeys.all,
    queryFn: getScopeableEntities,
  })
}

export function useRoleDataScopes(roleId: string) {
  return useQuery({
    queryKey: roleDataScopeKeys.assigned(roleId),
    queryFn: () => getRoleDataScopes(roleId),
    enabled: !!roleId,
  })
}

export function useUserDataScopes(userId: string) {
  return useQuery({
    queryKey: userDataScopeKeys.assigned(userId),
    queryFn: () => getUserDataScopes(userId),
    enabled: !!userId,
  })
}

export function useSyncRoleDataScopes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, ids }: { roleId: string; ids: string[] }) =>
      syncRoleDataScopes(roleId, ids),
    onSuccess: (_, { roleId }) => {
      qc.invalidateQueries({ queryKey: dataScopeRuleKeys.all })
      qc.invalidateQueries({ queryKey: roleDataScopeKeys.assigned(roleId) })
    },
  })
}

export function useSyncUserDataScopes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, ids }: { userId: string; ids: string[] }) =>
      syncUserDataScopes(userId, ids),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: dataScopeRuleKeys.all })
      qc.invalidateQueries({ queryKey: userDataScopeKeys.assigned(userId) })
    },
  })
}
