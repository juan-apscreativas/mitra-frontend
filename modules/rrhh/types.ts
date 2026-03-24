// Area types
export interface Area {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface CreateAreaInput {
  name: string
}

export interface UpdateAreaInput {
  name?: string
  status?: 'active' | 'inactive'
}

export interface AreaListParams {
  'filter[name]'?: string
  'filter[status]'?: string
  page?: number
  per_page?: number
  sort?: string
}

// Position types
export interface PositionDocument {
  document_id: string
  document_name: string
  is_required: boolean
}

export interface Position {
  id: string
  name: string
  area_id: string
  area_name: string
  status: 'active' | 'inactive'
  authorized_positions: number
  reports_to_id: string | null
  reports_to_name: string | null
  documents: PositionDocument[]
  created_at: string
  updated_at: string
}

export interface CreatePositionInput {
  name: string
  area_id: string
  authorized_positions: number
  reports_to_id?: string | null
  documents?: { document_id: string; is_required: boolean }[]
}

export interface UpdatePositionInput {
  name?: string
  area_id?: string
  authorized_positions?: number
  reports_to_id?: string | null
  status?: 'active' | 'inactive'
  documents?: { document_id: string; is_required: boolean }[]
}

export interface PositionListParams {
  'filter[name]'?: string
  'filter[status]'?: string
  'filter[area_id]'?: string
  page?: number
  per_page?: number
  sort?: string
}

// Document types
export interface Document {
  id: string
  name: string
  description: string | null
  is_required_by_default: boolean
  status: 'active' | 'inactive'
  positions_count: number
  created_at: string
  updated_at: string
}

export interface CreateDocumentInput {
  name: string
  description?: string | null
  is_required_by_default: boolean
}

export interface UpdateDocumentInput {
  name?: string
  description?: string | null
  is_required_by_default?: boolean
  status?: 'active' | 'inactive'
}

export interface DocumentListParams {
  'filter[name]'?: string
  'filter[status]'?: string
  page?: number
  per_page?: number
  sort?: string
}

// Employee types
export interface EmployeeDocument {
  id: string
  document_id: string
  document_name: string
  is_required: boolean
  is_uploaded: boolean
  file_url: string | null
  updated_at: string
}

export interface Employee {
  id: string
  name: string
  email: string
  position_id: string
  position_name: string
  area_name: string
  status: 'active' | 'blocked'
  hired_at: string
  location: string | null
  seniority_years: number
  user_id: string
  avatar_url: string | null
  required_docs_total: number
  required_docs_uploaded: number
  optional_docs_total: number
  optional_docs_uploaded: number
  is_docs_complete: boolean
  documents: EmployeeDocument[]
  created_at: string
  updated_at: string
}

export interface CreateEmployeeInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  position_id: string
  hired_at: string
  location?: string | null
}

export interface UpdateEmployeeInput {
  name?: string
  position_id?: string
  hired_at?: string
  location?: string | null
}

export interface EmployeeListParams {
  'filter[name]'?: string
  'filter[status]'?: string
  'filter[position_id]'?: string
  'filter[area_id]'?: string
  page?: number
  per_page?: number
  sort?: string
}

export interface EmployeeFormProps {
  defaultValues?: Partial<UpdateEmployeeInput>
  employeeId?: string
  mode: 'create' | 'edit'
  formId?: string
  onSuccess?: () => void
}

// Stats
export interface RrhhStatsMetric {
  key: string
  label: string
  value: number | string
}

export interface RrhhStats {
  metrics: RrhhStatsMetric[]
}

// Reports types
export interface ReportsAreaDistribution {
  area_name: string
  employee_count: number
}
export interface ReportsPositionOccupancy {
  position_name: string
  area_name: string
  occupied: number
  authorized: number
}
export interface ReportsDocCompliance {
  status: 'complete' | 'pending' | 'no_requirements'
  count: number
}
export interface ReportsPendingDocument {
  employee_id: string
  employee_name: string
  position_name: string
  area_name: string
  missing_count: number
  avatar_url: string | null
}
export interface ReportsEmployeeSummary {
  id: string
  name: string
  position_name: string
  area_name: string
  status: 'active' | 'blocked'
  seniority_years: number
  hired_at: string
  doc_status: 'complete' | 'pending' | 'no_requirements'
  required_docs_uploaded: number
  required_docs_total: number
  avatar_url: string | null
}
export interface ReportsData {
  metrics: RrhhStatsMetric[]
  charts: {
    area_distribution: ReportsAreaDistribution[]
    position_occupancy: ReportsPositionOccupancy[]
    doc_compliance: ReportsDocCompliance[]
  }
  pending_documents: ReportsPendingDocument[]
  employees: {
    data: ReportsEmployeeSummary[]
    meta: { current_page: number; last_page: number; per_page: number; total: number }
  }
}
export interface ReportsFilterParams {
  'filter[area_id]'?: string
  'filter[employee_status]'?: string
  'filter[doc_status]'?: string
  'filter[seniority_min]'?: string
  'filter[seniority_max]'?: string
  page?: number
  per_page?: number
  sort?: string
}

// Tab type
export type RrhhTab = 'org-chart' | 'employees' | 'positions' | 'areas' | 'documentation' | 'reports'

// Form prop types
export interface AreaFormProps {
  defaultValues?: Partial<UpdateAreaInput>
  areaId?: string
  mode: 'create' | 'edit'
  formId?: string
  onSuccess?: () => void
}

export interface PositionFormProps {
  defaultValues?: Partial<UpdatePositionInput> & { documents?: { document_id: string; is_required: boolean }[] }
  positionId?: string
  mode: 'create' | 'edit'
  formId?: string
  onSuccess?: () => void
}

export interface DocumentFormProps {
  defaultValues?: Partial<UpdateDocumentInput>
  documentId?: string
  mode: 'create' | 'edit'
  formId?: string
  onSuccess?: () => void
}

// Org Chart types
export interface OrgChartEmployee {
  id: string
  name: string
  status: 'active' | 'blocked'
  avatar_url: string | null
}

export interface OrgChartNode {
  id: string
  name: string
  area_id: string
  area_name: string
  reports_to_id: string | null
  authorized_positions: number
  employees: OrgChartEmployee[]
}
