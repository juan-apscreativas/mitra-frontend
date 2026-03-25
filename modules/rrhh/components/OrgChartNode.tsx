'use client'

import { ChevronDown, Users, Minus } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { labels } from '@/lib/labels'
import type { OrgChartEmployee } from '../types'

interface OrgChartNodeProps {
  positionName: string
  areaName: string
  employees: OrgChartEmployee[]
  vacancies: number
  hasChildren: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onClick: () => void
}

export function OrgChartNode({
  positionName,
  areaName,
  employees,
  vacancies,
  hasChildren,
  isExpanded,
  onToggleExpand,
  onClick,
}: OrgChartNodeProps) {
  const primaryEmployee = employees[0] ?? null
  const additionalCount = employees.length > 1 ? employees.length - 1 : 0

  return (
    <div className="relative flex flex-col items-center">
      {/* Node card */}
      <button
        type="button"
        onClick={onClick}
        className="group relative flex w-[220px] cursor-pointer flex-col rounded-xl bg-background p-3 ring-1 ring-foreground/10 transition-all hover:ring-primary/30"
      >
        {/* Position header */}
        <div className="mb-2 flex items-center justify-between gap-2 min-w-0">
          <span className="truncate text-[13px] font-semibold leading-tight text-foreground" title={positionName}>
            {positionName}
          </span>
          <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-[9px] font-medium">
            {areaName}
          </Badge>
        </div>

        {/* Divider */}
        <div className="mb-2 h-px w-full bg-foreground/5" />

        {/* Employee info */}
        <div className="flex items-center gap-2">
          {primaryEmployee ? (
            <>
              <Avatar size="sm">
                {primaryEmployee.avatar_url && (
                  <AvatarImage src={primaryEmployee.avatar_url} alt={primaryEmployee.name} />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {primaryEmployee.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-0.5">
                <span className="max-w-[110px] truncate text-xs font-medium text-foreground" title={primaryEmployee.name}>
                  {primaryEmployee.name}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-px text-[9px] font-medium ${
                    primaryEmployee.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {primaryEmployee.status === 'active'
                    ? labels.rrhh.employees.statuses.active
                    : labels.rrhh.employees.statuses.blocked}
                </span>
              </div>
              {additionalCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-semibold text-primary">
                  {labels.rrhh.orgChart.moreEmployees(additionalCount)}
                </span>
              )}
            </>
          ) : (
            <div className="flex w-full items-center justify-center gap-1.5 py-0.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-[11px]">{labels.rrhh.orgChart.noEmployees}</span>
            </div>
          )}
        </div>

        {/* Vacancies */}
        {vacancies > 0 && (
          <div className="mt-2 flex items-center justify-center">
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-px text-[10px] font-medium text-amber-700">
              {labels.rrhh.orgChart.vacancies(vacancies)}
            </span>
          </div>
        )}
      </button>

      {/* Expand/Collapse toggle — positioned below the card on the connector line */}
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          className="relative z-10 -mb-2.5 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10 hover:text-foreground"
          aria-label={isExpanded ? labels.rrhh.orgChart.collapse : labels.rrhh.orgChart.expand}
        >
          {isExpanded ? (
            <Minus className="h-2.5 w-2.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  )
}
