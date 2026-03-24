'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { labels } from '@/lib/labels'
import type { ReportsPendingDocument } from '../types'

const l = labels.rrhh.reports.pending

interface ReportsPendingListProps {
  items: ReportsPendingDocument[]
  onViewEmployee: (employeeId: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ReportsPendingList({ items, onViewEmployee }: ReportsPendingListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{l.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{l.empty}</p>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <button
                key={item.employee_id}
                type="button"
                onClick={() => onViewEmployee(String(item.employee_id))}
                className="flex w-full items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-muted/50 rounded-lg"
              >
                <Avatar className="h-9 w-9">
                  {item.avatar_url ? (
                    <AvatarImage src={item.avatar_url} alt={item.employee_name} />
                  ) : null}
                  <AvatarFallback className="text-xs">{getInitials(item.employee_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.employee_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.position_name} — {item.area_name}
                  </p>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 border shrink-0">
                  {l.missingDocs(item.missing_count)}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
