export interface DataScopeRule {
  id: string
  name: string
  entity: string
  entity_label: string
  type: 'own' | 'relation' | 'field_value' | 'all' | 'custom'
  configuration: Record<string, unknown>
  description: string | null
  created_at: string
  updated_at: string
}

export interface ScopeableEntity {
  entity: string
  label: string
}

export interface ScopePreviewResult {
  count: number
  sample: Array<{ id: number; label: string }>
}

export interface DataScopeRuleListParams {
  'filter[name]'?: string
  'filter[entity]'?: string
  'filter[type]'?: string
  'filter[description]'?: string
  page?: number
  per_page?: number
  sort?: string
}

export interface CreateDataScopeRuleInput {
  name: string
  entity: string
  entity_label: string
  type: string
  configuration: Record<string, unknown>
  description?: string
}

export interface UpdateDataScopeRuleInput {
  name?: string
  configuration?: Record<string, unknown>
  description?: string | null
}

export type DataScopeRuleType = 'own' | 'relation' | 'field_value' | 'all' | 'custom'

export interface DataScopeFormDefaults {
  name?: string
  entity?: string
  entity_label?: string
  type?: DataScopeRuleType
  configuration?: Record<string, unknown>
  description?: string | null
}

export interface DataScopeFormProps {
  defaultValues?: DataScopeFormDefaults
  ruleId?: string
  mode: 'create' | 'edit'
}

export interface DataScopeRulePreviewInput {
  entity: string
  type: string
  configuration: Record<string, unknown>
  user_id: string
}

export interface EffectiveDataScope {
  rule_id: string
  name: string
  entity: string
  entity_label: string
  type: string
  source: 'role' | 'direct'
  role_name: string | null
}
