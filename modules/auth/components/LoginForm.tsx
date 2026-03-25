'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { routes } from '@/config/routes'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useLogin } from '../hooks'
import { loginSchema, type LoginFormValues } from '../schemas'

export function LoginForm() {
  const router = useRouter()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      await login.mutateAsync(values)
      router.push(routes.afterLogin)
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80 px-1">
                {labels.auth.email}
              </FormLabel>
              <FormControl>
                <InputGroup className="h-14 rounded-xl">
                  <InputGroupAddon>
                    <Mail className="size-5 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    autoComplete="email"
                    placeholder={labels.auth.emailPlaceholder}
                    className="h-14"
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center px-1">
                <FormLabel className="text-sm font-semibold text-foreground/80">
                  {labels.auth.password}
                </FormLabel>
                <a
                  className="text-sm font-medium text-primary hover:underline"
                  href="/forgot-password"
                >
                  {labels.auth.forgotPassword}
                </a>
              </div>
              <FormControl>
                <InputGroup className="h-14 rounded-xl">
                  <InputGroupAddon>
                    <Lock className="size-5 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-14"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 font-headline font-bold rounded-xl shadow-lg shadow-primary/20 text-base gap-2"
          disabled={login.isPending}
        >
          <span>{login.isPending ? labels.common.loading : labels.auth.login}</span>
          <LogIn className="size-5" />
        </Button>
      </form>
    </Form>
  )
}
