'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useRole, useSyncRolePermissions, usePermissionsList } from '@/modules/roles/hooks'
import { useDataScopeRules, useRoleDataScopes, useSyncRoleDataScopes } from '@/modules/data-scopes/hooks'
import { PermissionMatrix } from '@/modules/roles/components/PermissionMatrix'
import { RoleFormDrawer } from '@/modules/roles/components/RoleFormDrawer'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Authorized } from '@/components/ui/authorized'
import { DetailField } from '@/components/ui/detail-section'
import { labels } from '@/lib/labels'
import type { Permission } from '@/modules/roles/types'

interface RoleDetailProps {
  id: string
}

export function RoleDetail({ id }: RoleDetailProps) {
  const router = useRouter()
  const { data, isLoading, error, refetch } = useRole(id)
  const { data: permissionsData } = usePermissionsList()
  const syncPermissions = useSyncRolePermissions()
  const { data: allScopeRulesData } = useDataScopeRules({ per_page: 100 })
  const { data: assignedScopeData } = useRoleDataScopes(id)
  const syncDataScopes = useSyncRoleDataScopes()
  const [editOpen, setEditOpen] = useState(false)

  const role = data?.data
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)
  const [scopesInitialized, setScopesInitialized] = useState(false)

  // Resolve permission names to IDs
  useEffect(() => {
    if (role && permissionsData && !initialized) {
      const allPermissions = Object.values(permissionsData.data).flat() as Permission[]
      const ids = role.permissions
        .map((name) => allPermissions.find((p) => p.name === name)?.id)
        .filter((id): id is number => id !== undefined)
      setSelectedPermissionIds(ids)
      setInitialized(true)
    }
  }, [role, permissionsData, initialized])

  // Initialize assigned scope rule IDs
  useEffect(() => {
    if (assignedScopeData && !scopesInitialized) {
      setSelectedScopeIds(assignedScopeData.data.map(String))
      setScopesInitialized(true)
    }
  }, [assignedScopeData, scopesInitialized])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!role) return <NotFoundState />

  async function handleSavePermissions() {
    try {
      await syncPermissions.mutateAsync({ roleId: id, permissions: selectedPermissionIds })
      toast.success(labels.roles.permissionsSynced)
    } catch {
      toast.error(labels.common.error)
    }
  }

  function handleToggle(permissionId: number, checked: boolean) {
    setSelectedPermissionIds((prev) =>
      checked ? [...prev, permissionId] : prev.filter((p) => p !== permissionId)
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{role.name}</h1>
            {role.is_system && (
              <Badge variant="secondary">{labels.roles.systemProtected}</Badge>
            )}
          </div>
        </div>
        <Authorized permission="roles.update">
          {!role.is_system && (
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              {labels.common.edit}
            </Button>
          )}
        </Authorized>
      </div>

      {role.description && (
        <p className="text-sm text-muted-foreground">{role.description}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{labels.roles.sections.info}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailField label={labels.roles.fields.usersCount} value={String(role.users_count)} />
          <DetailField label={labels.roles.fields.permissionsCount} value={String(role.permissions_count)} />
        </CardContent>
      </Card>

      <Authorized permission="roles.update">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{labels.permissions.matrix}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PermissionMatrix
              selectedPermissionIds={selectedPermissionIds}
              onToggle={handleToggle}
              disabled={role.is_system || syncPermissions.isPending}
            />
            {!role.is_system && (
              <Button onClick={handleSavePermissions} disabled={syncPermissions.isPending}>
                {syncPermissions.isPending ? labels.common.loading : labels.common.save}
              </Button>
            )}
          </CardContent>
        </Card>
      </Authorized>

      <Authorized permission="roles.update">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{labels.dataScopes.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              {allScopeRulesData?.data.map((rule) => (
                <label
                  key={rule.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedScopeIds.includes(String(rule.id))}
                    onCheckedChange={(checked) =>
                      setSelectedScopeIds((prev) =>
                        checked ? [...prev, String(rule.id)] : prev.filter((s) => s !== String(rule.id))
                      )
                    }
                    disabled={role.is_system || syncDataScopes.isPending}
                  />
                  <div>
                    <span className="text-sm font-medium">{rule.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {rule.entity_label} — {labels.dataScopes.types[rule.type]}
                    </p>
                  </div>
                </label>
              ))}
              {!allScopeRulesData?.data.length && (
                <p className="text-sm text-muted-foreground">{labels.dataScopes.empty}</p>
              )}
            </div>
            {!role.is_system && (
              <Button
                onClick={async () => {
                  try {
                    await syncDataScopes.mutateAsync({ roleId: id, ids: selectedScopeIds })
                    toast.success(labels.dataScopes.rulesSynced)
                  } catch {
                    toast.error(labels.common.error)
                  }
                }}
                disabled={syncDataScopes.isPending}
              >
                {syncDataScopes.isPending ? labels.common.loading : labels.common.save}
              </Button>
            )}
          </CardContent>
        </Card>
      </Authorized>

      <RoleFormDrawer open={editOpen} onOpenChange={setEditOpen} mode="edit" roleId={id} />
    </div>
  )
}
