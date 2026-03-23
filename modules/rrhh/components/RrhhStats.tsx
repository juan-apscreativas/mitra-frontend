'use client'

import { Building2, Briefcase, Users2, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useRrhhStats } from '../hooks/use-rrhh-stats'

const statConfig = [
  { key: 'active_areas', label: labels.rrhh.stats.activeAreas, icon: Building2, color: 'bg-blue-50 text-primary' },
  { key: 'active_positions', label: labels.rrhh.stats.activePositions, icon: Briefcase, color: 'bg-emerald-50 text-emerald-700' },
  { key: 'total_authorized_positions', label: labels.rrhh.stats.authorizedPositions, icon: Users2, color: 'bg-amber-50 text-amber-700' },
  { key: 'active_documents', label: labels.rrhh.stats.activeDocuments, icon: FileText, color: 'bg-blue-50 text-blue-700' },
] as const

export function RrhhStats() {
  const { data, isLoading } = useRrhhStats()

  if (isLoading) return <LoadingState />

  const stats = data?.data

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <CardAction>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.[key] ?? 0}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
