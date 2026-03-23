'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Truck,
  RotateCcw,
  FlaskConical,
  PackageOpen,
  Warehouse,
  Factory,
  Receipt,
  Calculator,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Shield,
  SlidersHorizontal,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useUser, useLogout } from '@/lib/auth'
import { labels } from '@/lib/labels'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: labels.nav.general,
    items: [
      { href: '/', label: labels.nav.dashboard, icon: LayoutDashboard },
    ],
  },
  {
    label: labels.nav.operations,
    items: [
      { href: '/proyectos', label: labels.nav.projects, icon: FolderKanban },
      { href: '/despacho', label: labels.nav.dispatch, icon: Truck },
      { href: '/devoluciones', label: labels.nav.returns, icon: RotateCcw },
      { href: '/muestras', label: labels.nav.samples, icon: FlaskConical },
    ],
  },
  {
    label: labels.nav.warehouse,
    items: [
      { href: '/recepcion', label: labels.nav.reception, icon: PackageOpen },
      { href: '/inventario', label: labels.nav.inventory, icon: Warehouse },
      { href: '/produccion', label: labels.nav.production, icon: Factory },
    ],
  },
  {
    label: labels.nav.finance,
    items: [
      { href: '/facturacion', label: labels.nav.billing, icon: Receipt },
      { href: '/contpaqi', label: labels.nav.contpaqi, icon: Calculator },
      { href: '/cxc', label: labels.nav.accountsReceivable, icon: ArrowUpRight },
      { href: '/cxp', label: labels.nav.accountsPayable, icon: ArrowDownLeft },
    ],
  },
  {
    label: labels.nav.administration,
    items: [
      { href: '/users', label: labels.nav.users, icon: Users, permission: 'users.view' },
      { href: '/roles', label: labels.nav.roles, icon: Shield, permission: 'roles.view' },
      { href: '/data-scopes', label: labels.nav.dataScopes, icon: SlidersHorizontal, permission: 'data_scopes.view' },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: user } = useUser()
  const logout = useLogout()

  const userPermissions = user?.permissions ?? []

  function hasPermission(permission: string): boolean {
    return userPermissions.some((p) => {
      if (p === permission) return true
      if (p.endsWith('.*')) {
        return permission.startsWith(p.slice(0, -1))
      }
      return false
    })
  }

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-lg font-bold">{labels.branding.appName}</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || hasPermission(item.permission)
          )
          if (visibleItems.length === 0) return null

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={item.label}
                        render={<Link href={item.href} />}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator />
        <div className="flex items-center justify-between pt-2">
          <div className="truncate">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="ml-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={labels.auth.logout}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
