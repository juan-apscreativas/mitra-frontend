'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useUser, useSyncUserRoles } from '@/modules/users/hooks'
import { useRoles } from '@/modules/roles/hooks'
import { useDataScopeRules, useUserDataScopes, useSyncUserDataScopes } from '@/modules/data-scopes/hooks'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Authorized } from '@/components/ui/authorized'
import { DetailField } from '@/components/ui/detail-section'
import { labels } from '@/lib/labels'
import { UserFormDrawer } from './UserFormDrawer'

interface UserDetailProps {
  id: string
}

export function UserDetail({ id }: UserDetailProps) {
  const router = useRouter()
  const { data, isLoading, error, refetch } = useUser(id)
  const { data: rolesData } = useRoles({ per_page: 100 })
  const syncRoles = useSyncUserRoles()
  const { data: allScopeRulesData } = useDataScopeRules({ per_page: 100 })
  const { data: assignedScopeData } = useUserDataScopes(id)
  const syncDataScopes = useSyncUserDataScopes()
  const [editOpen, setEditOpen] = useState(false)

  const user = data?.data
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)
  const [scopesInitialized, setScopesInitialized] = useState(false)

  useEffect(() => {
    if (user && !initialized) {
      setSelectedRoleIds(user.roles.map((r) => r.id))
      setInitialized(true)
    }
  }, [user, initialized])

  useEffect(() => {
    if (assignedScopeData && !scopesInitialized) {
      setSelectedScopeIds(assignedScopeData.data.map(String))
      setScopesInitialized(true)
    }
  }, [assignedScopeData, scopesInitialized])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || !user) return <NotFoundState />

  function handleRoleToggle(roleId: number, checked: boolean) {
    setSelectedRoleIds((prev) =>
      checked ? [...prev, roleId] : prev.filter((r) => r !== roleId)
    )
  }

  async function handleSaveRoles() {
    try {
      await syncRoles.mutateAsync({ userId: id, roles: selectedRoleIds })
      toast.success(labels.users.rolesUpdated)
      refetch()
    } catch {
      toast.error(labels.common.error)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Authorized permission="users.update">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            {labels.common.edit}
          </Button>
        </Authorized>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{labels.users.sections.info}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailField label={labels.users.fields.email} value={user.email} />
            <DetailField label={labels.users.fields.phone} value={user.phone} />
            <DetailField
              label={labels.users.fields.status}
              value={
                <Badge
                  className={
                    user.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
                      : 'bg-destructive/10 text-destructive'
                  }
                >
                  {labels.users.statuses[user.status as keyof typeof labels.users.statuses]}
                </Badge>
              }
            />
            <DetailField
              label={labels.users.lastLogin}
              value={
                user.last_login_at
                  ? new Date(user.last_login_at).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : null
              }
            />
            <DetailField
              label={labels.common.createdAt}
              value={new Date(user.created_at).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{labels.users.roles}</CardTitle>
          </CardHeader>
          <CardContent>
            {user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <Badge key={role.id} variant="secondary">
                    {role.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Authorized permission="users.manage_roles">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{labels.users.manageRoles}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              {rolesData?.data.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedRoleIds.includes(Number(role.id))}
                    onCheckedChange={(checked) => handleRoleToggle(Number(role.id), !!checked)}
                    disabled={syncRoles.isPending}
                  />
                  <div>
                    <span className="text-sm font-medium">{role.name}</span>
                    {role.description && (
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <Button onClick={handleSaveRoles} disabled={syncRoles.isPending}>
              {syncRoles.isPending ? labels.common.loading : labels.common.save}
            </Button>
          </CardContent>
        </Card>
      </Authorized>

      <Authorized permission="users.update">
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
                    checked={selectedScopeIds.includes(rule.id)}
                    onCheckedChange={(checked) =>
                      setSelectedScopeIds((prev) =>
                        checked ? [...prev, rule.id] : prev.filter((s) => s !== rule.id)
                      )
                    }
                    disabled={syncDataScopes.isPending}
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
            <Button
              onClick={async () => {
                try {
                  await syncDataScopes.mutateAsync({ userId: id, ids: selectedScopeIds })
                  toast.success(labels.dataScopes.rulesSynced)
                } catch {
                  toast.error(labels.common.error)
                }
              }}
              disabled={syncDataScopes.isPending}
            >
              {syncDataScopes.isPending ? labels.common.loading : labels.common.save}
            </Button>
          </CardContent>
        </Card>
      </Authorized>

      <UserFormDrawer open={editOpen} onOpenChange={setEditOpen} mode="edit" userId={id} />
    </div>
  )
}
