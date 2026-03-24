'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FormDrawerBody, FormDrawerSubmitFooter } from '@/components/ui/form-drawer'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useCreateEmployee, useUpdateEmployee, useLocations } from '../hooks/use-employees'
import { usePositions } from '../hooks/use-positions'
import { rrhhStatsKeys } from '../api/stats'
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  type CreateEmployeeFormValues,
  type UpdateEmployeeFormValues,
} from '../schemas'
import type { EmployeeFormProps, PositionListParams } from '../types'

type EmployeeFormValues = CreateEmployeeFormValues & UpdateEmployeeFormValues

export function EmployeeForm({ defaultValues, employeeId, mode, formId = 'employee-form', onSuccess }: EmployeeFormProps) {
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee()
  const queryClient = useQueryClient()

  const isEdit = mode === 'edit'
  const schema = isEdit ? updateEmployeeSchema : createEmployeeSchema

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaultValues ?? {
      name: '',
      email: '',
      ...(!isEdit ? { password: '', password_confirmation: '' } : {}),
      position_id: '',
      hired_at: '',
      location: '',
    },
  })

  // Fetch active positions for select
  const { data: positionsData } = usePositions({ per_page: 100, 'filter[status]': 'active' } as PositionListParams)
  const positions = positionsData?.data ?? []

  // Location combobox state
  const [locationQuery, setLocationQuery] = useState('')
  const { data: locationsData } = useLocations(locationQuery)
  const locationSuggestions = locationsData?.data ?? []

  async function onSubmit(values: EmployeeFormValues) {
    try {
      if (isEdit && employeeId) {
        await updateEmployee.mutateAsync({ id: employeeId, data: values })
        toast.success(labels.rrhh.employees.updated)
        await queryClient.invalidateQueries({ queryKey: rrhhStatsKeys.all })
        onSuccess?.()
      } else {
        await createEmployee.mutateAsync(values as CreateEmployeeFormValues)
        toast.success(labels.rrhh.employees.created)
        await queryClient.invalidateQueries({ queryKey: rrhhStatsKeys.all })
        onSuccess?.()
      }
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  return (
    <Form {...form}>
      <FormDrawerBody>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.employees.fields.name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEdit && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.rrhh.employees.fields.email}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'password' as never}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.rrhh.employees.fields.password}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'password_confirmation' as never}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.rrhh.employees.fields.passwordConfirmation}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="position_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.employees.fields.position}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="">{labels.rrhh.employees.selectPosition}</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hired_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.employees.fields.hiredAt}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.employees.fields.location}</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      list="location-suggestions"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        setLocationQuery(e.target.value)
                      }}
                    />
                    <datalist id="location-suggestions">
                      {locationSuggestions.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </FormDrawerBody>
      <FormDrawerSubmitFooter formId={formId} />
    </Form>
  )
}
