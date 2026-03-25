import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type { Document, DocumentListParams, CreateDocumentInput, UpdateDocumentInput } from '../types'

export const documentKeys = {
  all: ['rrhh', 'documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (params?: DocumentListParams) => [...documentKeys.lists(), params] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
}

export async function getDocuments(params?: DocumentListParams): Promise<PaginatedResponse<Document>> {
  return httpClient.get('/rrhh/documents', { params: params as Record<string, unknown> })
}

export async function getDocument(id: string): Promise<{ data: Document }> {
  return httpClient.get(`/rrhh/documents/${id}`)
}

export async function createDocument(data: CreateDocumentInput): Promise<{ data: Document }> {
  return httpClient.post('/rrhh/documents', data)
}

export async function updateDocument(id: string, data: UpdateDocumentInput): Promise<{ data: Document }> {
  return httpClient.put(`/rrhh/documents/${id}`, data)
}
