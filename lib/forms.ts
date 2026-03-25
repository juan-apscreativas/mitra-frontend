import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import { toast } from 'sonner'
import { ApiError } from '@/lib/http-client'
import { labels } from '@/lib/labels'

export function mapApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): void {
  if (!(error instanceof ApiError)) {
    toast.error(labels.common.error)
    return
  }

  // 422 with business error code → toast with the business message
  if (error.status === 422 && error.code) {
    toast.error(error.message || labels.common.error)
    return
  }

  // 422 with field validation errors → set errors on form fields
  if (error.status === 422 && error.errors) {
    for (const [field, messages] of Object.entries(error.errors)) {
      setError(field as Path<T>, { message: messages[0] })
    }
    return
  }

  toast.error(error.message || labels.common.error)
}
