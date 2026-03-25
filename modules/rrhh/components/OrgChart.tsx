'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RefreshCw } from 'lucide-react'
import { labels } from '@/lib/labels'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { useOrgChart } from '../hooks/use-org-chart'
import { useAreas } from '../hooks/use-areas'
import { OrgChartFilters } from './OrgChartFilters'
import { OrgChartTree } from './OrgChartTree'
import { OrgChartNodeDetailDrawer } from './OrgChartNodeDetailDrawer'

interface OrgChartProps {
  onViewEmployee: (employeeId: string) => void
}

export function OrgChart({ onViewEmployee }: OrgChartProps) {
  const { data, isLoading, isError, error, refetch } = useOrgChart()
  const { data: areasData } = useAreas({ per_page: 100, 'filter[status]': 'active' })

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [employeeStatus, setEmployeeStatus] = useState<'all' | 'active' | 'blocked'>('all')
  const [detailDrawer, setDetailDrawer] = useState<{ open: boolean; positionId: string | null }>({
    open: false,
    positionId: null,
  })

  const nodes = useMemo(() => data?.data ?? [], [data])
  const areas = areasData?.data ?? []

  const selectedNode = useMemo(() => {
    if (!detailDrawer.positionId) return null
    return nodes.find((n) => String(n.id) === detailDrawer.positionId) ?? null
  }, [nodes, detailDrawer.positionId])

  const handleNodeClick = useCallback((positionId: string) => {
    setDetailDrawer({ open: true, positionId })
  }, [])

  // Zoom & pan state
  const ZOOM_MIN = 0.3
  const ZOOM_MAX = 1.5
  const ZOOM_STEP = 0.15
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
  }, [])

  const handleReset = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Fullscreen (CSS-based to keep drawer portals working)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!isFullscreen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isFullscreen])

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setZoom((z) => {
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, +(z + delta).toFixed(2)))
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Pan handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only pan on middle-click or when clicking the background (not nodes)
    if (e.button === 1 || (e.button === 0 && (e.target as HTMLElement).closest('[data-org-chart-bg]'))) {
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }
  }, [pan])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    })
  }, [isPanning])

  const handlePointerUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  if (nodes.length === 0) return <EmptyState message={labels.rrhh.orgChart.empty} />

  const zoomPercent = Math.round(zoom * 100)

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 space-y-4 overflow-auto bg-background p-4' : 'space-y-4'}>
      <div className="flex flex-wrap items-center gap-3">
        <OrgChartFilters
          areas={areas}
          selectedAreaId={selectedAreaId}
          onAreaChange={setSelectedAreaId}
          employeeStatus={employeeStatus}
          onEmployeeStatusChange={setEmployeeStatus}
        />

        {/* Toolbar */}
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-muted p-0.5">
          <button
            type="button"
            onClick={() => refetch()}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            title={labels.common.refresh}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <div className="mx-0.5 h-4 w-px bg-foreground/10" />
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex h-7 min-w-[3rem] items-center justify-center rounded-md px-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {zoomPercent}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-40"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <div className="mx-0.5 h-4 w-px bg-foreground/10" />
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            title={isFullscreen ? labels.rrhh.orgChart.collapse : labels.rrhh.orgChart.expand}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Zoomable/pannable container */}
      <div
        ref={containerRef}
        data-org-chart-bg
        className="relative select-none overflow-hidden rounded-lg border border-border/50 bg-muted/30"
        style={{ height: isFullscreen ? 'calc(100vh - 120px)' : 'calc(100vh - 460px)', minHeight: '300px', cursor: isPanning ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="absolute inset-0 flex items-start justify-center overflow-visible p-8 transition-transform duration-100"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          <OrgChartTree
            nodes={nodes}
            selectedAreaId={selectedAreaId}
            employeeStatus={employeeStatus}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      <OrgChartNodeDetailDrawer
        open={detailDrawer.open}
        onOpenChange={(open) => setDetailDrawer((prev) => ({ ...prev, open }))}
        node={selectedNode}
        employeeStatus={employeeStatus}
        onViewEmployee={onViewEmployee}
      />
    </div>
  )
}
