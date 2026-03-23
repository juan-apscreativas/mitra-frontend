'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { SortingState, OnChangeFn } from '@tanstack/react-table'

interface UseTableParamsOptions {
  defaultSort?: string
  defaultPerPage?: number
}

interface UseTableParamsReturn {
  sorting: SortingState
  columnFilters: Record<string, string>
  page: number
  perPage: number
  apiParams: Record<string, unknown>
  onSortingChange: OnChangeFn<SortingState>
  onColumnFilterChange: (columnId: string, value: string | null) => void
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export function useTableParams(
  options: UseTableParamsOptions = {}
): UseTableParamsReturn {
  const { defaultSort, defaultPerPage = 15 } = options
  const searchParams = useSearchParams()
  const router = useRouter()

  const sortParam = searchParams.get('sort') ?? defaultSort ?? null
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('per_page')) || defaultPerPage

  const sorting: SortingState = useMemo(() => {
    if (!sortParam) return []
    const desc = sortParam.startsWith('-')
    const id = desc ? sortParam.slice(1) : sortParam
    return [{ id, desc }]
  }, [sortParam])

  const columnFilters: Record<string, string> = useMemo(() => {
    const filters: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      const match = key.match(/^filter\[(.+)\]$/)
      if (match && value) {
        filters[match[1]] = value
      }
    })
    return filters
  }, [searchParams])

  const apiParams: Record<string, unknown> = useMemo(() => {
    const params: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(columnFilters)) {
      params[`filter[${key}]`] = value
    }
    params.page = page
    params.per_page = perPage
    if (sortParam) params.sort = sortParam
    return params
  }, [columnFilters, page, perPage, sortParam])

  const updateParams = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const newParams = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          newParams.set(key, value)
        } else {
          newParams.delete(key)
        }
      }
      if (resetPage && !('page' in updates)) {
        newParams.delete('page')
      }
      router.push(`?${newParams.toString()}`)
    },
    [searchParams, router]
  )

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      if (newSorting.length === 0) {
        updateParams({ sort: null })
      } else {
        const { id, desc } = newSorting[0]
        updateParams({ sort: desc ? `-${id}` : id })
      }
    },
    [sorting, updateParams]
  )

  const onColumnFilterChange = useCallback(
    (columnId: string, value: string | null) => {
      updateParams({ [`filter[${columnId}]`]: value })
    },
    [updateParams]
  )

  const onPageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: String(newPage) }, false)
    },
    [updateParams]
  )

  const onPerPageChange = useCallback(
    (newPerPage: number) => {
      updateParams({ per_page: String(newPerPage) })
    },
    [updateParams]
  )

  return {
    sorting,
    columnFilters,
    page,
    perPage,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  }
}
