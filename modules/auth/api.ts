import { httpClient } from '@/lib/http-client'
import type {
  LoginInput,
  LoginResponse,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './types'

export async function login(data: LoginInput): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>('/login', data)
}

export async function forgotPassword(data: ForgotPasswordInput) {
  return httpClient.post('/forgot-password', data)
}

export async function resetPassword(data: ResetPasswordInput) {
  return httpClient.post('/reset-password', data)
}

export async function changePassword(data: ChangePasswordInput) {
  return httpClient.put('/user/password', data)
}
