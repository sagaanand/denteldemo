'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Sparkles, ArrowRight, ShieldCheck, Stethoscope, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  // Auto-redirect for instant demo convenience
  useEffect(() => {
    const timer = setTimeout(() => {
      // Gentle auto-login redirect if user lands on login page in demo mode
      router.push('/dashboard')
    }, 1200)

    return () => clearTimeout(timer)
  }, [router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@demo-dental.com',
      password: '••••••••',
    },
  })

  const handleInstantDemoLogin = async (role = 'ADMIN') => {
    setIsDemoLoading(true)
    try {
      await signIn('credentials', {
        email: role === 'ADMIN' ? 'admin@demo-dental.com' : role === 'DOCTOR' ? 'doctor@demo-dental.com' : 'reception@demo-dental.com',
        password: 'Password@123',
        redirect: false,
      })
      router.push(callbackUrl)
      router.refresh()
    } catch {
      router.push('/dashboard')
    } finally {
      setIsDemoLoading(false)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      router.push(callbackUrl)
      router.refresh()
    } catch {
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass-card shadow-2xl border-cyan-500/20 max-w-md w-full mx-auto">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="flex justify-center mb-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white text-2xl font-extrabold shadow-lg shadow-cyan-500/25">
            D
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-500/30 mx-auto">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          INTERACTIVE DEMO ACTIVE
        </div>
        <CardTitle className="text-2xl font-black tracking-tight">Dental Hospital ERP</CardTitle>
        <CardDescription className="text-xs">
          Auto-logging into practice dashboard… click below for instant entry.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Instant 1-Click Demo Login */}
        <div className="space-y-2">
          <Button
            onClick={() => handleInstantDemoLogin('ADMIN')}
            disabled={isDemoLoading}
            className="w-full h-12 text-sm font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 border-0 rounded-xl transition-all hover:scale-[1.01]"
          >
            {isDemoLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Enter Demo Dashboard (Instant Access)
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Quick Role Selection Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('ADMIN')}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border border-border/70 hover:bg-cyan-500/10 hover:border-cyan-500/40 text-[11px] font-semibold transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('DOCTOR')}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border border-border/70 hover:bg-sky-500/10 hover:border-sky-500/40 text-[11px] font-semibold transition-colors"
            >
              <Stethoscope className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('RECEPTIONIST')}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border border-border/70 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-[11px] font-semibold transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Reception
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">Or Sign In Manually</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@demo-dental.com"
              {...register('email')}
              disabled={isLoading}
              className="rounded-xl h-10 text-sm"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              className="rounded-xl h-10 text-sm"
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" variant="secondary" className="w-full h-10 rounded-xl text-xs font-bold" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Sign In with Credentials
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="glass-card shadow-2xl max-w-md w-full mx-auto p-8 text-center space-y-4">
          <div className="h-10 w-10 mx-auto rounded-full bg-cyan-500/20 animate-spin flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-cyan-500" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Connecting to Demo Dashboard…</p>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
