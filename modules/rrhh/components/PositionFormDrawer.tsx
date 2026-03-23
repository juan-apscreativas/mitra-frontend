'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { usePosition } from '../hooks/use-positions'
import { PositionForm } from './PositionForm'

interface PositionFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  positionId?: string
}

export function PositionFormDrawer({ open, onOpenChange, mode, positionId }: PositionFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = usePosition(positionId ?? '', { enabled: isEdit && !!positionId && open })
  const position = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${position?.name ?? ''}`
    : labels.rrhh.positions.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${positionId}`} open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <PositionForm
            mode={mode}
            positionId={positionId}
            defaultValues={
              isEdit && position
                ? {
                    name: position.name,
                    area_id: position.area_id,
                    authorized_positions: position.authorized_positions,
                    reports_to_id: position.reports_to_id,
                    status: position.status,
                    documents: position.documents.map((d) => ({
                      document_id: d.document_id,
                      is_required: d.is_required,
                    })),
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
