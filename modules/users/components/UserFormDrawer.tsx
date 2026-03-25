'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useUser, useUploadAvatar, useDeleteAvatar } from '../hooks'
import { UserForm } from './UserForm'

interface UserFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  userId?: string
}

export function UserFormDrawer({ open, onOpenChange, mode, userId }: UserFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading, refetch } = useUser(userId ?? '', { enabled: isEdit && !!userId && open })
  const user = data?.data

  const uploadAvatar = useUploadAvatar()
  const deleteAvatar = useDeleteAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const title = isEdit
    ? `${labels.common.edit}: ${user?.name ?? ''}`
    : labels.users.create

  function handleSuccess() {
    onOpenChange(false)
  }

  const initials = user?.name
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
          if (!file || !user) return
          try {
            await uploadAvatar.mutateAsync({ userId: String(user.id), file })
            toast.success(labels.users.avatar.uploaded)
            refetch()
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : labels.users.avatar.uploadError)
          }
          if (fileInputRef.current) fileInputRef.current.value = ''
        }}
      />

      <FormDrawer key={`${mode}-${userId}`} open={open} onOpenChange={onOpenChange}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <FormDrawerTitle>{title}</FormDrawerTitle>
          </FormDrawerHeader>

          {isEdit && isLoading ? (
            <LoadingState />
          ) : (
            <>
              {/* Avatar section — only in edit mode */}
              {isEdit && user && (
                <div className="flex flex-col items-center gap-2 px-6 pt-2 pb-4">
                  <div className="group relative">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-2 ring-foreground/5 transition-all hover:ring-primary/30"
                    >
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-lg font-medium">
                          {initials}
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 transition-colors group-hover:bg-foreground/40">
                        <Camera className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </button>

                    {user.avatar_url && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await deleteAvatar.mutateAsync(String(user.id))
                            toast.success(labels.users.avatar.deleted)
                            refetch()
                          } catch (err: unknown) {
                            toast.error(err instanceof Error ? err.message : labels.users.avatar.deleteError)
                          }
                        }}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background transition-all hover:bg-foreground/10 hover:text-foreground"
                        title={labels.users.avatar.delete}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {labels.users.avatar.formats}
                  </span>
                </div>
              )}

              <UserForm
                mode={mode}
                userId={userId}
                defaultValues={
                  isEdit && user
                    ? {
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        status: user.status,
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
