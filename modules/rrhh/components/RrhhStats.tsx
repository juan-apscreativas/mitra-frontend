'use client'

import {
  Users, UserX, CheckCircle, AlertCircle, Briefcase, Building2,
  FileText, GitBranch, Eye, BarChart3, Percent, Clock, Hash
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { useRrhhStats } from '../hooks/use-rrhh-stats'
import type { RrhhTab } from '../types'

const iconMap: Record<string, { icon: LucideIcon; color: string }> = {
  active_employees: { icon: Users, color: 'bg-emerald-50 text-emerald-700' },
  blocked_employees: { icon: UserX, color: 'bg-destructive/10 text-destructive' },
  avg_seniority: { icon: Clock, color: 'bg-blue-50 text-primary' },
  complete_docs: { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700' },
  active_positions: { icon: Briefcase, color: 'bg-blue-50 text-primary' },
  authorized_positions: { icon: Hash, color: 'bg-blue-50 text-primary' },
  occupied_positions: { icon: Users, color: 'bg-emerald-50 text-emerald-700' },
  vacancies: { icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
  active_areas: { icon: Building2, color: 'bg-blue-50 text-primary' },
  current_occupancy: { icon: Users, color: 'bg-emerald-50 text-emerald-700' },
  area_vacancies: { icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
  employees_with_docs: { icon: FileText, color: 'bg-blue-50 text-primary' },
  pending_docs: { icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
  missing_documents: { icon: FileText, color: 'bg-destructive/10 text-destructive' },
  root_positions: { icon: GitBranch, color: 'bg-blue-50 text-primary' },
  visible_positions: { icon: Eye, color: 'bg-blue-50 text-primary' },
  visible_employees: { icon: Users, color: 'bg-emerald-50 text-emerald-700' },
  visible_vacancies: { icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
  headcount: { icon: Users, color: 'bg-blue-50 text-primary' },
  occupancy_rate: { icon: Percent, color: 'bg-emerald-50 text-emerald-700' },
  doc_compliance_rate: { icon: BarChart3, color: 'bg-emerald-50 text-emerald-700' },
}

const defaultIcon = { icon: BarChart3, color: 'bg-muted text-muted-foreground' }

interface RrhhStatsProps {
  activeTab: RrhhTab
  filters?: Record<string, string>
}

export function RrhhStats({ activeTab, filters }: RrhhStatsProps) {
  const { data, isLoading, isError, error, refetch } = useRrhhStats(activeTab, filters)
  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  const metrics = data?.data?.metrics ?? []
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map(({ key, label, value }) => {
        const { icon: Icon, color } = iconMap[key] ?? defaultIcon
        return (
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
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
