import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user && process.env.DEV_BYPASS_AUTH !== 'true') {
    redirect('/login')
  }

  const hospitalId = session?.user?.hospitalId

  // Fetch hospital info safely
  let hospital = null
  if (hospitalId) {
    try {
      hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        select: {
          name: true,
          plan: true,
          logo: true,
          onboardingCompleted: true,
        },
      })
    } catch {
      // DB connection offline fallback
    }
  }

  // Redirect to onboarding if not complete (except if already on onboarding page)
  if (hospital && !hospital.onboardingCompleted) {
    redirect('/onboarding')
  }

  const user = {
    name: session?.user?.name || 'Dr. Abinauv (Demo Admin)',
    email: session?.user?.email || 'admin@demo-dental.com',
    role: session?.user?.role || 'ADMIN',
  }

  const hospitalInfo = hospital
    ? {
        name: hospital.name,
        plan: hospital.plan,
        logo: hospital.logo,
      }
    : {
        name: 'Demo Dental Clinic',
        plan: 'PROFESSIONAL',
        logo: null,
      }

  return (
    <DashboardShell user={user} hospital={hospitalInfo}>
      {children}
    </DashboardShell>
  )
}
