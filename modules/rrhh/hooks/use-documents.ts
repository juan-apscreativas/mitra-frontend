import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentKeys, getDocuments, getDocument, createDocument, updateDocument } from '../api/documents'
import type { DocumentListParams, CreateDocumentInput, UpdateDocumentInput } from '../types'

export function useDocuments(params?: DocumentListParams) {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: () => getDocuments(params),
  })
}

export function useDocument(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => getDocument(id),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDocumentInput) => createDocument(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentInput }) => updateDocument(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  })
}
