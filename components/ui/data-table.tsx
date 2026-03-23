'use client'

import {
  type ColumnDef,
  type SortingState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DebouncedInput } from '@/components/ui/debounced-input'
import { labels } from '@/lib/labels'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  pagination?: PaginationMeta
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  columnFilters?: Record<string, string>
  onColumnFilterChange?: (columnId: string, value: string | null) => void
  filterOptions?: Record<string, { label: string; value: string }[]>
  onPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

const ALL_VALUE = '__all__'
const PER_PAGE_OPTIONS = [10, 15, 25, 50]

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pagination,
  sorting = [],
  onSortingChange,
  columnFilters = {},
  onColumnFilterChange,
  filterOptions = {},
  onPageChange,
  onPerPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableMultiSort: false,
    state: { sorting },
    onSortingChange,
  })

  if (isLoading) {
    return (
      <div className="space-y-px rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-9 w-full rounded-none ${i === 0 ? 'bg-muted/60' : ''}`}
          />
        ))}
      </div>
    )
  }

  const hasFilters = columns.some((c) => c.meta?.filterType)

  return (
    <div className="space-y-3">
      <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b-foreground/10 bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      className="h-9 text-xs font-medium text-muted-foreground tracking-wide uppercase"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="group/sort inline-flex items-center gap-1 transition-colors hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className={`inline-flex ${sorted ? 'text-foreground' : 'opacity-0 group-hover/sort:opacity-40'} transition-opacity`}>
                            {sorted === 'asc' ? (
                              <ChevronUp className="size-3" />
                            ) : sorted === 'desc' ? (
                              <ChevronDown className="size-3" />
                            ) : (
                              <ChevronDown className="size-3" />
                            )}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}

            {onColumnFilterChange && hasFilters && (
              <TableRow className="border-b-foreground/10 hover:bg-transparent">
                {table.getHeaderGroups()[0]?.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const columnId = header.column.id
                  const filterValue = columnFilters[columnId] ?? ''

                  return (
                    <TableHead key={`filter-${header.id}`} className="h-8 py-1 px-2">
                      {meta?.filterType === 'text' ? (
                        <DebouncedInput
                          value={filterValue}
                          onChange={(val) =>
                            onColumnFilterChange(columnId, val || null)
                          }
                          placeholder={meta.filterPlaceholder ?? labels.table.filterPlaceholder}
                          className="h-7 rounded-md border-transparent bg-transparent text-xs placeholder:text-muted-foreground/50 hover:bg-muted/50 focus-visible:border-input focus-visible:bg-transparent focus-visible:ring-1 focus-visible:ring-ring/30"
                        />
                      ) : meta?.filterType === 'select' ? (
                        <Select
                          value={filterValue || ALL_VALUE}
                          onValueChange={(val) =>
                            onColumnFilterChange(
                              columnId,
                              val === ALL_VALUE ? null : val
                            )
                          }
                        >
                          <SelectTrigger className="h-7 border-transparent bg-transparent text-xs hover:bg-muted/50 focus-visible:border-input focus-visible:ring-1 focus-visible:ring-ring/30 data-placeholder:text-muted-foreground/50">
                            <SelectValue placeholder={labels.table.allItems} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL_VALUE}>
                              {labels.table.allItems}
                            </SelectItem>
                            {(filterOptions[columnId] ?? []).map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : null}
                    </TableHead>
                  )
                })}
              </TableRow>
            )}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b-foreground/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  {labels.table.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground tabular-nums">
            {labels.table.results(pagination.total)}
          </p>

          <div className="flex items-center gap-3">
            {onPerPageChange && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {labels.table.perPage}
                </span>
                <Select
                  value={String(pagination.per_page)}
                  onValueChange={(val) => {
                    if (val) onPerPageChange(Number(val))
                  }}
                >
                  <SelectTrigger size="sm" className="h-7 w-14 text-xs border-foreground/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PER_PAGE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {pagination.last_page > 1 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground tabular-nums px-1">
                  {pagination.current_page}/{pagination.last_page}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onPageChange?.(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onPageChange?.(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.last_page}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
