export interface UserRole {
  id: number
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  status: 'active' | 'inactive' | 'blocked'
  avatar_url: string | null
  last_login_at: string | null
  roles: UserRole[]
  created_at: string
  updated_at: string
}

export interface UserListParams {
  'filter[name]'?: string
  'filter[email]'?: string
  'filter[status]'?: string
  'filter[role]'?: string
  'filter[date_from]'?: string
  'filter[date_to]'?: string
  page?: number
  per_page?: number
  sort?: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  phone?: string | null
  status?: 'active' | 'inactive' | 'blocked'
}

export interface UserFormProps {
  defaultValues?: Partial<UpdateUserInput>
  userId?: string
  mode: 'create' | 'edit'
}
