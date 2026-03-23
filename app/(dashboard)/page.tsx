'use client'

import { useUser } from '@/lib/auth'
import { labels } from '@/lib/labels'
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/components/ui/card'
import {
  LayoutGrid,
  Diamond,
  DollarSign,
  Users,
  TriangleAlert,
  Zap,
  ShoppingCart,
  Truck,
  FileText,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'

const statCards = [
  {
    label: labels.dashboard.stats.activeProjects,
    value: '12',
    subtitle: labels.dashboard.stats.activeProjectsSub,
    icon: LayoutGrid,
  },
  {
    label: labels.dashboard.stats.pendingOrders,
    value: '8',
    subtitle: labels.dashboard.stats.pendingOrdersSub,
    icon: Diamond,
  },
  {
    label: labels.dashboard.stats.monthlyBilling,
    value: '$1.2M',
    subtitle: labels.dashboard.stats.monthlyBillingSub,
    icon: DollarSign,
  },
  {
    label: labels.dashboard.stats.activeEmployees,
    value: '47',
    subtitle: labels.dashboard.stats.activeEmployeesSub,
    icon: Users,
  },
]

const alerts = [
  {
    message: labels.dashboard.alerts.purchaseOrdersDue,
    time: labels.dashboard.alerts.ago2h,
    color: 'bg-amber-500',
  },
  {
    message: labels.dashboard.alerts.lowStock,
    time: labels.dashboard.alerts.ago4h,
    color: 'bg-amber-500',
  },
  {
    message: labels.dashboard.alerts.productionComplete,
    time: labels.dashboard.alerts.ago6h,
    color: 'bg-emerald-500',
  },
  {
    message: labels.dashboard.alerts.invoicePending,
    time: labels.dashboard.alerts.ago1d,
    color: 'bg-blue-500',
  },
]

const quickActions = [
  {
    label: labels.dashboard.quickActions.newPurchaseOrder,
    href: '/recepcion',
    icon: ShoppingCart,
  },
  {
    label: labels.dashboard.quickActions.registerDispatch,
    href: '/despacho',
    icon: Truck,
  },
  {
    label: labels.dashboard.quickActions.createInvoice,
    href: '/facturacion',
    icon: FileText,
  },
  {
    label: labels.dashboard.quickActions.assignTask,
    href: '/proyectos',
    icon: ClipboardList,
  },
]

export default function DashboardPage() {
  const { data: user } = useUser()

  const roleDisplay = user?.roles.length ? user.roles.join(' / ') : ''

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{labels.dashboard.title}</h1>
        <p className="text-sm text-muted-foreground">
          {labels.dashboard.subtitle} {roleDisplay}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <CardAction>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Alerts Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TriangleAlert className="h-5 w-5 text-amber-500" />
              {labels.dashboard.alerts.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {alerts.map((alert) => (
                <div key={alert.message} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${alert.color}`} />
                  <div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Zap className="h-5 w-5 text-primary" />
              {labels.dashboard.quickActions.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
