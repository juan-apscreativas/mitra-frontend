'use client'

import {
  Bar, BarChart, XAxis, YAxis, CartesianGrid,
  Pie, PieChart, Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { labels } from '@/lib/labels'
import type { ReportsAreaDistribution, ReportsPositionOccupancy, ReportsDocCompliance } from '../types'

const l = labels.rrhh.reports.charts

interface ReportsChartsProps {
  areaDistribution: ReportsAreaDistribution[]
  positionOccupancy: ReportsPositionOccupancy[]
  docCompliance: ReportsDocCompliance[]
}

const docComplianceColors: Record<string, string> = {
  complete: 'oklch(0.7 0.17 163)',
  pending: 'oklch(0.8 0.15 86)',
  no_requirements: 'oklch(0.7 0.15 254)',
}

const docComplianceConfig: ChartConfig = {
  complete: { label: l.complete, color: docComplianceColors.complete },
  pending: { label: l.pending, color: docComplianceColors.pending },
  no_requirements: { label: l.noRequirements, color: docComplianceColors.no_requirements },
}

const areaDistConfig: ChartConfig = {
  employee_count: { label: l.employees, color: 'var(--color-primary)' },
}

const positionOccupancyConfig: ChartConfig = {
  occupied: { label: l.occupied, color: 'var(--color-primary)' },
  authorized: { label: l.authorized, color: 'oklch(0.8 0.15 86)' },
}

export function ReportsCharts({
  areaDistribution,
  positionOccupancy,
  docCompliance,
}: ReportsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Area Distribution — horizontal bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{l.areaDistribution}</CardTitle>
        </CardHeader>
        <CardContent>
          {areaDistribution.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">—</p>
          ) : (
            <ChartContainer config={areaDistConfig} className="aspect-auto h-[250px] w-full">
              <BarChart data={areaDistribution} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="area_name" type="category" width={120} tick={{ fontSize: 12 }} />
                <XAxis type="number" allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="employee_count" fill="var(--color-employee_count)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Doc Compliance — donut pie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{l.docCompliance}</CardTitle>
        </CardHeader>
        <CardContent>
          {docCompliance.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">—</p>
          ) : (
            <ChartContainer config={docComplianceConfig} className="aspect-auto h-[250px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                <Pie
                  data={docCompliance}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={90}
                >
                  {docCompliance.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={docComplianceColors[entry.status] ?? 'var(--color-muted)'}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="status" />} />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Position Occupancy — grouped bar, full width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">{l.positionOccupancy}</CardTitle>
        </CardHeader>
        <CardContent>
          {positionOccupancy.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">—</p>
          ) : (
            <ChartContainer config={positionOccupancyConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={positionOccupancy} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="position_name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="occupied" fill="var(--color-occupied)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="authorized" fill="var(--color-authorized)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
