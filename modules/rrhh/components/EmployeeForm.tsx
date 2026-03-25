'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Shuffle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  function handleGeneratePassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const digits = '0123456789'
    const symbols = '!@#$%'
    const all = upper + lower + digits + symbols
    const pick = (s: string) => s[Math.floor(Math.random() * s.length)]
    // Guarantee at least 1 of each required category
    const required = [pick(upper), pick(lower), pick(digits), pick(symbols)]
    for (let i = required.length; i < 16; i++) required.push(pick(all))
    // Shuffle
    const password = required.sort(() => Math.random() - 0.5).join('')
    form.setValue('password' as never, password as never)
    form.setValue('password_confirmation' as never, password as never)
  }

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
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
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
                    <div className="flex items-center justify-between">
                      <FormLabel>{labels.rrhh.employees.fields.password}</FormLabel>
                      <Button type="button" variant="ghost" size="sm" onClick={handleGeneratePassword}>
                        <Shuffle className="h-3 w-3 mr-1" />
                        {labels.rrhh.employees.generatePassword}
                      </Button>
                    </div>
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
            render={({ field }) => {
              const grouped = positions.reduce<Record<string, typeof positions>>((acc, pos) => {
                const area = pos.area_name
                if (!acc[area]) acc[area] = []
                acc[area].push(pos)
                return acc
              }, {})

              return (
                <FormItem>
                  <FormLabel>{labels.rrhh.employees.fields.position}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="">{labels.rrhh.employees.selectPosition}</option>
                      {Object.entries(grouped).map(([areaName, areaPositions]) => (
                        <optgroup key={areaName} label={areaName}>
                          {areaPositions.map((pos) => (
                            <option key={pos.id} value={pos.id}>
                              {pos.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
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
                      autoComplete="off"
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
