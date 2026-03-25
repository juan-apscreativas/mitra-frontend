'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MoreHorizontal, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { usePermissions } from '@/lib/permissions'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useDuplicateRole } from '../hooks'
import { duplicateRoleSchema, type DuplicateRoleFormValues } from '../schemas'
import type { Role } from '../types'

interface RoleActionsProps {
  role: Role
  onView?: () => void
  onEdit?: () => void
}

export function RoleActions({ role, onView, onEdit }: RoleActionsProps) {
  const { can } = usePermissions()
  const router = useRouter()
  const [cloneOpen, setCloneOpen] = useState(false)
  const duplicate = useDuplicateRole()

  const showView = can('roles.view')
  const showEdit = !role.is_system && can('roles.update')
  const showClone = can('roles.create')

  const form = useForm<DuplicateRoleFormValues>({
    resolver: zodResolver(duplicateRoleSchema),
    defaultValues: { name: '' },
  })

  async function onCloneSubmit(values: DuplicateRoleFormValues) {
    try {
      await duplicate.mutateAsync({ id: role.id, name: values.name })
      toast.success(labels.roles.duplicated)
      setCloneOpen(false)
      form.reset()
      router.push('/roles')
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  if (!showView && !showEdit && !showClone) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">{labels.common.actions}</span>
            </Button>
          }
        />
        <DropdownMenuContent>
          {showView && onView && (
            <DropdownMenuItem onClick={onView}>
              {labels.common.view}
            </DropdownMenuItem>
          )}
          {showView && (
            <DropdownMenuItem render={<Link href={`/roles/${role.id}`} />}>
              {labels.common.manage}
            </DropdownMenuItem>
          )}
          {showEdit && (
            <DropdownMenuItem onClick={onEdit}>
              {labels.common.edit}
            </DropdownMenuItem>
          )}
          {showClone && (
            <DropdownMenuItem onClick={() => setCloneOpen(true)}>
              <Copy className="mr-2 h-4 w-4" />
              {labels.roles.duplicate}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={cloneOpen} onOpenChange={setCloneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{labels.roles.duplicate}: {role.name}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCloneSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.roles.duplicateName}</FormLabel>
                    <FormControl>
                      <Input placeholder={`${role.name} (copia)`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose render={<Button variant="outline" type="button" />}>
                  {labels.common.cancel}
                </DialogClose>
                <Button type="submit" disabled={duplicate.isPending}>
                  {duplicate.isPending ? labels.common.loading : labels.roles.duplicate}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
