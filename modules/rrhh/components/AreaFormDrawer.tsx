'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useArea } from '../hooks/use-areas'
import { AreaForm } from './AreaForm'

interface AreaFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  areaId?: string
}

export function AreaFormDrawer({ open, onOpenChange, mode, areaId }: AreaFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = useArea(areaId ?? '', { enabled: isEdit && !!areaId && open })
  const area = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${area?.name ?? ''}`
    : labels.rrhh.areas.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${areaId}`} open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <AreaForm
            mode={mode}
            areaId={areaId}
            defaultValues={
              isEdit && area
                ? {
                    name: area.name,
                    status: area.status,
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
