'use client'

import { useUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { routes } from '@/config/routes'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.replace(routes.afterLogin)
    }
  }, [user, isLoading, router])

  if (isLoading) return null

  return <>{children}</>
}
