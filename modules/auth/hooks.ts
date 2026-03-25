import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userKeys } from '@/lib/auth'
import { tokenStorage } from '@/lib/token-storage'
import { login, forgotPassword, resetPassword, changePassword } from './api'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      tokenStorage.set(response.data.token)
      queryClient.invalidateQueries({ queryKey: userKeys.current })
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}
