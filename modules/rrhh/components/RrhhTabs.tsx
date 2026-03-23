'use client'

import { Network, Users, Briefcase, Building2, FileText, BarChart3 } from 'lucide-react'
import { labels } from '@/lib/labels'
import type { RrhhTab } from '../types'

interface TabConfig {
  id: RrhhTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  disabled: boolean
}

const tabs: TabConfig[] = [
  { id: 'org-chart', label: labels.rrhh.tabs.orgChart, icon: Network, disabled: true },
  { id: 'employees', label: labels.rrhh.tabs.employees, icon: Users, disabled: true },
  { id: 'positions', label: labels.rrhh.tabs.positions, icon: Briefcase, disabled: false },
  { id: 'areas', label: labels.rrhh.tabs.areas, icon: Building2, disabled: false },
  { id: 'documentation', label: labels.rrhh.tabs.documentation, icon: FileText, disabled: false },
  { id: 'reports', label: labels.rrhh.tabs.reports, icon: BarChart3, disabled: true },
]

interface RrhhTabsProps {
  activeTab: RrhhTab
  onTabChange: (tab: RrhhTab) => void
}

export function RrhhTabs({ activeTab, onTabChange }: RrhhTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
      {tabs.map(({ id, label, icon: Icon, disabled }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onTabChange(id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/10'
                : disabled
                  ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                  : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}{disabled ? ` (${labels.rrhh.tabs.comingSoon})` : ''}</span>
          </button>
        )
      })}
    </div>
  )
}
