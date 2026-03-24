'use client'

import { useRef } from 'react'
import { FileUpIcon, ExternalLinkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { labels } from '@/lib/labels'
import { useUploadDocument } from '../hooks/use-employees'
import type { Employee, EmployeeDocument } from '../types'

interface EmployeeDocumentsProps {
  employee: Employee
  onDocumentUploaded?: () => void
}

export function EmployeeDocuments({ employee, onDocumentUploaded }: EmployeeDocumentsProps) {
  const uploadDoc = useUploadDocument()
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const requiredDocs = employee.documents.filter((d) => d.is_required)
  const optionalDocs = employee.documents.filter((d) => !d.is_required)
  const requiredUploaded = requiredDocs.filter((d) => d.is_uploaded).length
  const optionalUploaded = optionalDocs.filter((d) => d.is_uploaded).length

  function handleUpload(employeeDocId: string, file: File) {
    uploadDoc.mutate(
      { employeeId: String(employee.id), documentId: employeeDocId, file },
      { onSuccess: () => onDocumentUploaded?.() }
    )
  }

  function triggerFileInput(docId: string) {
    fileInputRefs.current[docId]?.click()
  }

  if (employee.documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{labels.rrhh.employees.docs.noDocuments}</p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {labels.rrhh.employees.docs.requiredSummary(requiredUploaded, requiredDocs.length)}
        </span>
        <span className="text-sm text-muted-foreground">
          {labels.rrhh.employees.docs.optionalSummary(optionalUploaded, optionalDocs.length)}
        </span>
        <Badge variant={employee.is_docs_complete ? 'default' : 'destructive'}>
          {employee.is_docs_complete
            ? labels.rrhh.employees.docs.complete
            : labels.rrhh.employees.docs.incomplete}
        </Badge>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {employee.documents.map((doc) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            employeeId={String(employee.id)}
            isUploading={uploadDoc.isPending}
            fileInputRef={(el) => { fileInputRefs.current[doc.id] = el }}
            onTriggerUpload={() => triggerFileInput(doc.id)}
            onFileSelected={(file) => handleUpload(doc.id, file)}
          />
        ))}
      </div>
    </div>
  )
}

interface DocumentRowProps {
  doc: EmployeeDocument
  employeeId: string
  isUploading: boolean
  fileInputRef: (el: HTMLInputElement | null) => void
  onTriggerUpload: () => void
  onFileSelected: (file: File) => void
}

function DocumentRow({ doc, isUploading, fileInputRef, onTriggerUpload, onFileSelected }: DocumentRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-input p-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm truncate">{doc.document_name}</span>
        <Badge variant="outline">
          {doc.is_required
            ? labels.rrhh.employees.docs.required
            : labels.rrhh.employees.docs.optional}
        </Badge>
        <Badge variant={doc.is_uploaded ? 'default' : 'secondary'}>
          {doc.is_uploaded
            ? labels.rrhh.employees.docs.uploaded
            : labels.rrhh.employees.docs.pending}
        </Badge>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {doc.is_uploaded && doc.file_url && (
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<a href={doc.file_url} target="_blank" rel="noopener noreferrer" />}
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onTriggerUpload}
          disabled={isUploading}
        >
          <FileUpIcon className="size-4 mr-1" />
          {doc.is_uploaded
            ? labels.rrhh.employees.docs.replace
            : labels.rrhh.employees.docs.upload}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onFileSelected(file)
              e.target.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}
