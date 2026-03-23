'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useDocument } from '../hooks/use-documents'
import { DocumentForm } from './DocumentForm'

interface DocumentFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  documentId?: string
}

export function DocumentFormDrawer({ open, onOpenChange, mode, documentId }: DocumentFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = useDocument(documentId ?? '', { enabled: isEdit && !!documentId && open })
  const document = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${document?.name ?? ''}`
    : labels.rrhh.documents.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${documentId}`} open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <DocumentForm
            mode={mode}
            documentId={documentId}
            defaultValues={
              isEdit && document
                ? {
                    name: document.name,
                    description: document.description,
                    is_required_by_default: document.is_required_by_default,
                    status: document.status,
                  }
                : undefined
            }
            onSuccess={handleSuccess}
          />
        )}
      </FormDrawerContent>
    </FormDrawer>
  )
}
