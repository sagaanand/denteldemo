import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuthAndRole } from '@/lib/api-helpers'

// GET - List doctors only (for appointments)
export async function GET(request: NextRequest) {
  const { error, hospitalId, session } = await requireAuthAndRole()
  if (error || !hospitalId) {
    return error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const doctors = await prisma.staff.findMany({
      where: {
        hospitalId,
        isActive: true,
        user: {
          role: 'DOCTOR',
          isActive: true,
        },
      },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        specialization: true,
        phone: true,
        email: true,
      },
      orderBy: { firstName: 'asc' },
    })

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error('Error fetching doctors (using demo fallback):', error)
    return NextResponse.json({
      doctors: [
        {
          id: 'doc-1',
          employeeId: 'EMP001',
          firstName: 'Dr. Priya',
          lastName: 'Kumar',
          specialization: 'Orthodontics',
          phone: '+91 98765 43211',
          email: 'priya.k@demo-dental.com',
        },
        {
          id: 'doc-2',
          employeeId: 'EMP002',
          firstName: 'Dr. Abinauv',
          lastName: 'Selvaraj',
          specialization: 'Endodontics & Implantology',
          phone: '+91 98765 43210',
          email: 'admin@demo-dental.com',
        },
      ],
    })
  }
}
