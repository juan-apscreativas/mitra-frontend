export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    id: string
    name: string
    email: string
    token: string
  }
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordInput {
  current_password: string
  password: string
  password_confirmation: string
}
