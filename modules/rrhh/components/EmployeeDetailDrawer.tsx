'use client'

import { useState } from 'react'
import { Pencil, FileTextIcon } from 'lucide-react'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerBody,
  FormDrawerFooter,
} from '@/components/ui/form-drawer'
import { DetailSection, DetailField } from '@/components/ui/detail-section'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import { useEmployee } from '../hooks/use-employees'
import { EmployeeFormDrawer } from './EmployeeFormDrawer'
import { EmployeeDocumentUploadDrawer } from './EmployeeDocumentUploadDrawer'
import type { Employee } from '../types'

interface EmployeeDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId?: string
}

const statusVariant: Record<Employee['status'], 'default' | 'destructive'> = {
  active: 'default',
  blocked: 'destructive',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function EmployeeDetailDrawer({ open, onOpenChange, employeeId }: EmployeeDetailDrawerProps) {
  const { data, isLoading, isError, error, refetch } = useEmployee(employeeId ?? '', {
    enabled: !!employeeId && open,
  })
  const employee = data?.data
  const [editOpen, setEditOpen] = useState(false)
  const [docUploadOpen, setDocUploadOpen] = useState(false)

  const docs = employee?.documents ?? []
  const requiredDocs = docs.filter((d) => d.is_required)
  const optionalDocs = docs.filter((d) => !d.is_required)
  const requiredUploaded = requiredDocs.filter((d) => d.is_uploaded).length
  const optionalUploaded = optionalDocs.filter((d) => d.is_uploaded).length

  const seniorityDisplay = employee?.seniority_years != null
    ? `${employee.seniority_years.toFixed(1)} ${labels.rrhh.employees.seniorityYears}`
    : undefined

  return (
    <>
      <FormDrawer open={open} onOpenChange={onOpenChange} key={employeeId}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <div className="flex items-center gap-2">
              <FormDrawerTitle>{employee?.name ?? ''}</FormDrawerTitle>
              {employee && (
                <Badge variant={statusVariant[employee.status]}>
                  {labels.rrhh.employees.statuses[employee.status]}
                </Badge>
              )}
            </div>
            {employee && (
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            )}
          </FormDrawerHeader>

          {isError ? (
            <FormDrawerBody>
              <ErrorState error={error} onRetry={refetch} />
            </FormDrawerBody>
          ) : isLoading || !employee ? (
            <FormDrawerBody>
              <LoadingState />
            </FormDrawerBody>
          ) : (
            <FormDrawerBody className="space-y-6">
              <DetailSection title={labels.rrhh.employees.sections.info}>
                <DetailField
                  label={labels.rrhh.employees.fields.name}
                  value={employee.name}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.email}
                  value={employee.email}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.position}
                  value={employee.position_name}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.area}
                  value={employee.area_name}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.hiredAt}
                  value={formatDate(employee.hired_at)}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.seniority}
                  value={seniorityDisplay}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.location}
                  value={employee.location}
                />
                <DetailField
                  label={labels.rrhh.employees.fields.status}
                  value={
                    <Badge variant={statusVariant[employee.status]}>
                      {labels.rrhh.employees.statuses[employee.status]}
                    </Badge>
                  }
                />
              </DetailSection>

              <DetailSection title={labels.rrhh.employees.docs.compliance}>
                <div className="flex items-center gap-2 py-2">
                  <span className="text-sm text-muted-foreground">
                    {labels.rrhh.employees.docs.requiredSummary(requiredUploaded, requiredDocs.length)}
                  </span>
                  <span className="text-sm text-muted-foreground">&middot;</span>
                  <span className="text-sm text-muted-foreground">
                    {labels.rrhh.employees.docs.optionalSummary(optionalUploaded, optionalDocs.length)}
                  </span>
                  <Badge variant={employee.is_docs_complete ? 'default' : 'destructive'}>
                    {employee.is_docs_complete
                      ? labels.rrhh.employees.docs.complete
                      : labels.rrhh.employees.docs.incomplete}
                  </Badge>
                </div>
                {docs.length === 0 ? (
                  <p className="py-2 text-sm text-muted-foreground">
                    {labels.rrhh.employees.docs.noDocuments}
                  </p>
                ) : (
                  docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">{doc.document_name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.is_required
                            ? labels.rrhh.employees.docs.required
                            : labels.rrhh.employees.docs.optional}
                        </Badge>
                        <Badge
                          variant={doc.is_uploaded ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {doc.is_uploaded
                            ? labels.rrhh.employees.docs.uploaded
                            : labels.rrhh.employees.docs.pending}
                        </Badge>
                        {doc.is_uploaded && doc.file_url && (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xs"
                          >
                            {labels.common.view}
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </DetailSection>
            </FormDrawerBody>
          )}

          <FormDrawerFooter className="justify-center gap-2">
            <Authorized permission="employees.update">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  setTimeout(() => setDocUploadOpen(true), 220)
                }}
              >
                <FileTextIcon className="h-4 w-4" />
                {labels.rrhh.employees.docs.manageDocs}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  setTimeout(() => setEditOpen(true), 220)
                }}
              >
                <Pencil className="h-4 w-4" />
                {labels.common.edit}
              </Button>
            </Authorized>
          </FormDrawerFooter>
        </FormDrawerContent>
      </FormDrawer>

      {employeeId && (
        <>
          <EmployeeFormDrawer
            open={editOpen}
            onOpenChange={setEditOpen}
            mode="edit"
            employeeId={employeeId}
          />
          <EmployeeDocumentUploadDrawer
            open={docUploadOpen}
            onOpenChange={setDocUploadOpen}
            employeeId={employeeId}
          />
        </>
      )}
    </>
  )
}
