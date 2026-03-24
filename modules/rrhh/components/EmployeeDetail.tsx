'use client'

import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useEmployee, useBlockEmployee, useUnblockEmployee } from '../hooks/use-employees'
import { EmployeeDocuments } from './EmployeeDocuments'

interface EmployeeDetailProps {
  employeeId: string
  onEdit?: () => void
}

export function EmployeeDetail({ employeeId, onEdit }: EmployeeDetailProps) {
  const { data, isLoading, error, refetch } = useEmployee(employeeId)
  const blockEmployee = useBlockEmployee()
  const unblockEmployee = useUnblockEmployee()

  const employee = data?.data

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || !employee) return <NotFoundState />

  function handleToggleBlock() {
    if (!employee) return
    if (employee.status === 'active') {
      blockEmployee.mutate(String(employee.id), {
        onSuccess: () => {
          refetch()
          toast.success(labels.rrhh.employees.blocked)
        },
      })
    } else {
      unblockEmployee.mutate(String(employee.id), {
        onSuccess: () => {
          refetch()
          toast.success(labels.rrhh.employees.unblocked)
        },
      })
    }
  }

  const seniorityDisplay = employee.seniority_years != null
    ? `${employee.seniority_years.toFixed(1)} ${labels.rrhh.employees.seniorityYears}`
    : '—'

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onEdit}>
          {labels.common.edit}
        </Button>
        <Button
          variant={employee.status === 'active' ? 'destructive' : 'default'}
          onClick={handleToggleBlock}
          disabled={blockEmployee.isPending || unblockEmployee.isPending}
        >
          {employee.status === 'active'
            ? labels.rrhh.employees.blockAction
            : labels.rrhh.employees.unblockAction}
        </Button>
      </div>

      {/* Info section */}
      <div className="rounded-lg ring-1 ring-foreground/10 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.name}</span>
            <p className="text-sm font-medium">{employee.name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.email}</span>
            <p className="text-sm font-medium">{employee.email}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.position}</span>
            <p className="text-sm font-medium">{employee.position_name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.area}</span>
            <p className="text-sm font-medium">{employee.area_name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.hiredAt}</span>
            <p className="text-sm font-medium">{employee.hired_at}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.seniority}</span>
            <p className="text-sm font-medium">{seniorityDisplay}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.location}</span>
            <p className="text-sm font-medium">{employee.location ?? '—'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{labels.rrhh.employees.fields.status}</span>
            <p className="text-sm">
              <Badge variant={employee.status === 'active' ? 'default' : 'destructive'}>
                {labels.rrhh.employees.statuses[employee.status]}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Documents section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{labels.rrhh.employees.docs.compliance}</h3>
        <EmployeeDocuments employee={employee} onDocumentUploaded={() => refetch()} />
      </div>
    </div>
  )
}
