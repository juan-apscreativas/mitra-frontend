'use client'

import { useUser, useLogout } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingState } from '@/components/ui/states'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search, Bell, LogOut } from 'lucide-react'
import { labels } from '@/lib/labels'
import { routes } from '@/config/routes'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useUser()
  const router = useRouter()
  const logout = useLogout()

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      router.replace(routes.auth.login)
    }
  }, [user, isLoading, error, router])

  if (isLoading) return <LoadingState />
  if (!user) return null

  const roleDisplay = user.roles.length > 0 ? user.roles.join(' / ') : ''
  const initials = getInitials(user.name)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-4" />
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={labels.common.search} className="pl-9 h-9" />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {roleDisplay && (
              <>
                <span className="text-sm text-muted-foreground">{roleDisplay}</span>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}
            <Button variant="ghost" size="icon-sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar>
              {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user?.name ?? ''} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
