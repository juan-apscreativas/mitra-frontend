import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm'
import { AuthShell } from '@/modules/auth/components/AuthShell'
import { labels } from '@/lib/labels'

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title={labels.auth.resetPassword}
      subtitle={labels.auth.resetPasswordSubtitle}
      footer={
        <div className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            {labels.auth.backToLogin}
          </Link>
        </div>
      }
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
