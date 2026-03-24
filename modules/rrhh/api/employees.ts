import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type { Employee, EmployeeListParams, CreateEmployeeInput, UpdateEmployeeInput } from '../types'

export const employeeKeys = {
  all: ['rrhh', 'employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params?: EmployeeListParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
}

export const locationKeys = {
  all: ['rrhh', 'locations'] as const,
  search: (q?: string) => [...locationKeys.all, q] as const,
}

export async function getEmployees(params?: EmployeeListParams): Promise<PaginatedResponse<Employee>> {
  return httpClient.get('/rrhh/employees', { params: params as Record<string, unknown> })
}

export async function getEmployee(id: string): Promise<{ data: Employee }> {
  return httpClient.get(`/rrhh/employees/${id}`)
}

export async function createEmployee(data: CreateEmployeeInput): Promise<{ data: Employee; temporary_password?: string }> {
  return httpClient.post('/rrhh/employees', data)
}

export async function updateEmployee(id: string, data: UpdateEmployeeInput): Promise<{ data: Employee }> {
  return httpClient.put(`/rrhh/employees/${id}`, data)
}

export async function blockEmployee(id: string): Promise<{ data: Employee }> {
  return httpClient.put(`/rrhh/employees/${id}/block`)
}

export async function unblockEmployee(id: string): Promise<{ data: Employee }> {
  return httpClient.put(`/rrhh/employees/${id}/unblock`)
}

export async function uploadEmployeeDocument(employeeId: string, documentId: string, file: File): Promise<{ data: Employee }> {
  const formData = new FormData()
  formData.append('file', file)
  return httpClient.post(`/rrhh/employees/${employeeId}/documents/${documentId}/upload`, formData)
}

export async function getLocations(query?: string): Promise<{ data: string[] }> {
  return httpClient.get('/rrhh/employees/locations', { params: query ? { q: query } : undefined })
}
