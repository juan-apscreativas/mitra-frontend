import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  employeeKeys,
  locationKeys,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  blockEmployee,
  unblockEmployee,
  uploadEmployeeDocument,
  uploadEmployeeAvatar,
  deleteEmployeeAvatar,
  getLocations,
  resetEmployeePassword,
} from '../api/employees'
import type { EmployeeListParams, CreateEmployeeInput, UpdateEmployeeInput } from '../types'

export function useEmployees(params?: EmployeeListParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => getEmployees(params),
  })
}

export function useEmployee(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployee(id),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEmployeeInput) => createEmployee(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) => updateEmployee(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  })
}

export function useBlockEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blockEmployee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  })
}

export function useUnblockEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unblockEmployee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ employeeId, documentId, file }: { employeeId: string; documentId: string; file: File }) =>
      uploadEmployeeDocument(employeeId, documentId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.employeeId) })
    },
  })
}

export function useUploadEmployeeAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      uploadEmployeeAvatar(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteEmployeeAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => deleteEmployeeAvatar(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useResetEmployeePassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { password: string; password_confirmation: string } }) =>
      resetEmployeePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

export function useLocations(query?: string) {
  return useQuery({
    queryKey: locationKeys.search(query),
    queryFn: () => getLocations(query),
  })
}
