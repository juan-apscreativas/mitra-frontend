'use client'

import { useState } from 'react'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerBody,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { useEmployee } from '../hooks/use-employees'
import { EmployeeDetail } from './EmployeeDetail'
import { EmployeeFormDrawer } from './EmployeeFormDrawer'

interface EmployeeDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId?: string
}

export function EmployeeDetailDrawer({ open, onOpenChange, employeeId }: EmployeeDetailDrawerProps) {
  const { data, isLoading } = useEmployee(employeeId ?? '', { enabled: !!employeeId && open })
  const employee = data?.data
  const [editOpen, setEditOpen] = useState(false)

  function handleEdit() {
    setEditOpen(true)
  }

  return (
    <>
      <FormDrawer open={open} onOpenChange={onOpenChange} size="lg">
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>{employee?.name ?? ''}</FormDrawerTitle>
          </FormDrawerHeader>
          <FormDrawerBody>
            {isLoading ? (
              <LoadingState />
            ) : employeeId ? (
              <EmployeeDetail employeeId={employeeId} onEdit={handleEdit} />
            ) : null}
          </FormDrawerBody>
        </FormDrawerContent>
      </FormDrawer>
      {employeeId && (
        <EmployeeFormDrawer
          open={editOpen}
          onOpenChange={setEditOpen}
          mode="edit"
          employeeId={employeeId}
        />
      )}
    </>
  )
}
