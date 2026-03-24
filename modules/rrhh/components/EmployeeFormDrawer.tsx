'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useEmployee } from '../hooks/use-employees'
import { EmployeeForm } from './EmployeeForm'

interface EmployeeFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  employeeId?: string
}

export function EmployeeFormDrawer({ open, onOpenChange, mode, employeeId }: EmployeeFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = useEmployee(employeeId ?? '', { enabled: isEdit && !!employeeId && open })
  const employee = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${employee?.name ?? ''}`
    : labels.rrhh.employees.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${employeeId}`} open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <EmployeeForm
            mode={mode}
            employeeId={employeeId}
            defaultValues={
              isEdit && employee
                ? {
                    name: employee.name,
                    position_id: String(employee.position_id),
                    hired_at: employee.hired_at,
                    location: employee.location ?? '',
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
