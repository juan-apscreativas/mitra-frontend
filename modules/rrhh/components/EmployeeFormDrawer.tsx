'use client'

import { useRef } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useEmployee, useUploadEmployeeAvatar, useDeleteEmployeeAvatar } from '../hooks/use-employees'
import { EmployeeForm } from './EmployeeForm'

interface EmployeeFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  employeeId?: string
}

export function EmployeeFormDrawer({ open, onOpenChange, mode, employeeId }: EmployeeFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading, refetch } = useEmployee(employeeId ?? '', { enabled: isEdit && !!employeeId && open })
  const employee = data?.data

  const uploadAvatar = useUploadEmployeeAvatar()
  const deleteAvatar = useDeleteEmployeeAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const title = isEdit
    ? `${labels.common.edit}: ${employee?.name ?? ''}`
    : labels.rrhh.employees.create

  function handleSuccess() {
    onOpenChange(false)
  }

  const initials = employee?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? ''

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file || !employee) return
          try {
            await uploadAvatar.mutateAsync({ userId: employee.user_id, file })
            toast.success(labels.users.avatar.uploaded)
            refetch()
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : labels.users.avatar.uploadError)
          }
          if (fileInputRef.current) fileInputRef.current.value = ''
        }}
      />

      <FormDrawer key={`${mode}-${employeeId}`} open={open} onOpenChange={onOpenChange}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>{title}</FormDrawerTitle>
          </FormDrawerHeader>

          {isEdit && isLoading ? (
            <LoadingState />
          ) : (
            <>
              {/* Avatar section — only in edit mode (user exists) */}
              {isEdit && employee && (
                <div className="flex items-center gap-4 px-6 pb-4">
                  <Avatar size="lg">
                    {employee.avatar_url && <AvatarImage src={employee.avatar_url} alt={employee.name} />}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-3.5 w-3.5" />
                        {employee.avatar_url ? labels.users.avatar.replace : labels.users.avatar.upload}
                      </Button>
                      {employee.avatar_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={async () => {
                            try {
                              await deleteAvatar.mutateAsync(employee.user_id)
                              toast.success(labels.users.avatar.deleted)
                              refetch()
                            } catch (err: unknown) {
                              toast.error(err instanceof Error ? err.message : labels.users.avatar.deleteError)
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {labels.users.avatar.delete}
                        </Button>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {labels.users.avatar.formats}
                    </span>
                  </div>
                </div>
              )}

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
            </>
          )}
        </FormDrawerContent>
      </FormDrawer>
    </>
  )
}
