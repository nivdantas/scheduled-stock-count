import type { Metadata } from 'next'
import { LoginForm } from '../components/LoginForm.tsx'
import { LoginHeader } from '../components/LoginHeader.tsx'

export const metadata: Metadata = {
  title: 'Login | Stock Flow',
  description: 'Acesso seguro ao sistema de gerenciamento de estoque.',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <LoginHeader />

        <div className="mt-2">
          <LoginForm />
        </div>

      </div>

    </main>
  )
}
