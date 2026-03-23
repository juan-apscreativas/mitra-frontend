import { cn } from '@/lib/utils'

interface DetailSectionProps extends React.ComponentProps<'div'> {
  title: string
}

function DetailSection({ title, className, children, ...props }: DetailSectionProps) {
  return (
    <div data-slot="detail-section" className={cn('space-y-3', className)} {...props}>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-0 divide-y divide-border/50">{children}</div>
    </div>
  )
}

interface DetailFieldProps extends React.ComponentProps<'div'> {
  label: string
  value?: React.ReactNode
}

function DetailField({ label, value, className, ...props }: DetailFieldProps) {
  return (
    <div
      data-slot="detail-field"
      className={cn('flex items-center justify-between py-2.5', className)}
      {...props}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value ?? '—'}</span>
    </div>
  )
}

export { DetailSection, DetailField }
