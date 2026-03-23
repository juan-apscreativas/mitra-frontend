export interface Role {
  id: string
  name: string
  description: string | null
  is_system: boolean
  users_count: number
  permissions_count: number
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  module: string
  action: string
  label: string
  description: string | null
}

export type PermissionsGrouped = Record<string, Permission[]>

export interface RoleListParams {
  'filter[name]'?: string
  'filter[description]'?: string
  page?: number
  per_page?: number
  sort?: string
}

export interface CreateRoleInput {
  name: string
  description?: string
}

export interface UpdateRoleInput {
  name?: string
  description?: string | null
}

export interface UserPermissionEntry {
  permission_id: number
  type: 'grant' | 'deny'
}

export interface EffectivePermission {
  name: string
  source: 'role' | 'direct_grant' | 'direct_deny'
  role_name: string | null
  effective: boolean
}

export interface EffectiveDataScopeEntry {
  rule_id: string
  name: string
  entity: string
  entity_label: string
  type: string
  source: 'role' | 'direct'
  role_name: string | null
}

export interface EffectiveAccess {
  permissions: EffectivePermission[]
  data_scopes: EffectiveDataScopeEntry[]
}

export interface RoleFormProps {
  defaultValues?: Partial<CreateRoleInput>
  roleId?: string
  mode: 'create' | 'edit'
}
