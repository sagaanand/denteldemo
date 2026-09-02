'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  Receipt,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Plus,
  Stethoscope,
  Video,
  Activity,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { InsightsPanel } from '@/components/ai/insights-panel'
import { CHART_COLORS } from '@/lib/chart-theme'

interface DashboardStats {
  overview: {
    totalPatients: number
    newPatientsThisMonth: number
    patientGrowth: number
    todayAppointments: number
    thisMonthAppointments: number
    appointmentGrowth: number
    pendingAppointments: number
    completedAppointmentsToday: number
    thisMonthRevenue: number
    todayRevenue: number
    revenueGrowth: number
    pendingPayments: number
    totalRevenue: number
  }
  charts: {
    last7DaysRevenue: Array<{ date: string; revenue: number }>
    last6MonthsRevenue: Array<{ month: string; revenue: number }>
    appointmentsByStatus: Array<{ status: string; count: number }>
    topProcedures: Array<{ name: string; count: number; revenue: number }>
  }
  recentActivity: {
    upcomingAppointments: Array<{
      id: string
      patientName: string
      doctorName: string
      date: string
      type: string
      status: string
    }>
    lowStockItems: Array<{
      id: string
      name: string
      currentStock: number
      minimumStock: number
      unit: string
    }>
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics')
      }

      const data = await response.json()
      setStats(data.data)
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-72 bg-muted/60 rounded-md animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-red-600">Failed to load dashboard data</p>
        </div>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{error || 'An error occurred'}</p>
            </div>
            <Button onClick={fetchDashboardStats} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-900 via-cyan-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-32 -bottom-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Dental Hospital ERP • Interactive Demo
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Good Morning, Dr. Abinauv 👋
            </h1>
            <p className="text-sm md:text-base text-cyan-100/80 max-w-2xl">
              Welcome to your practice dashboard. Here is today's live operational summary for Demo Dental Hospital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/appointments/new">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 border-0">
                <Plus className="mr-1.5 h-4 w-4" /> Book Appointment
              </Button>
            </Link>
            <Link href="/patients/new">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                <Users className="mr-1.5 h-4 w-4" /> New Patient
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Patients</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">
              {stats.overview.totalPatients.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />+{stats.overview.patientGrowth}%
              </span>
              <span className="text-muted-foreground">+{stats.overview.newPatientsThisMonth} this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Today's Appointments</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">
              {stats.overview.todayAppointments}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> {stats.overview.completedAppointmentsToday} done
              </span>
              <span>•</span>
              <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium">
                <Clock className="h-3.5 w-3.5 mr-1" /> {stats.overview.pendingAppointments} pending
              </span>
            </div>
          </CardContent>
        </Card>

        {/* This Month Revenue */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">This Month Revenue</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.overview.thisMonthRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />+{stats.overview.revenueGrowth}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Receivables */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Receivables</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Receipt className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
              {formatCurrency(stats.overview.pendingPayments)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Unbilled & outstanding balances
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Bar */}
      <Card className="glass-card border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 via-sky-500/5 to-indigo-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            AI Practice Insights & Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InsightsPanel />
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Trend Area Chart */}
        <Card className="glass-card lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">7-Day Revenue Trend</CardTitle>
            <CardDescription>Daily revenue performance for the current week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={stats.charts.last7DaysRevenue.map((item: any) => ({
                  date: format(new Date(item.date), 'MMM dd'),
                  revenue: Number(item.revenue),
                }))}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(val) => (typeof val === 'number' ? formatCurrency(val) : '')} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Appointments List */}
        <Card className="glass-card lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold">Today's Schedule</CardTitle>
              <CardDescription>Upcoming appointments</CardDescription>
            </div>
            <Link href="/appointments">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.doctorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {format(new Date(apt.date), 'hh:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts & Stock Alerts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Appointments by Status */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-bold">Appointments Breakdown</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.charts.appointmentsByStatus.map((item: any) => ({
                    name: item.status,
                    value: item.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.charts.appointmentsByStatus.map((_: any, idx: number) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Procedures */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Procedures</CardTitle>
            <CardDescription>Most requested treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={stats.charts.topProcedures.map((proc: any) => ({
                  name: proc.name.length > 15 ? proc.name.substring(0, 15) + '..' : proc.name,
                  count: Number(proc.count),
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Procedures" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-500" /> Inventory Alerts
              </CardTitle>
              <CardDescription>Low stock warnings</CardDescription>
            </div>
            <Link href="/inventory">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                Manage <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-muted-foreground">Min required: {item.minimumStock} {item.unit}</p>
                  </div>
                  <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Clinical Modules</CardTitle>
          <CardDescription>Direct shortcuts to key practice workflows</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Link
            href="/patients"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 group text-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Patients</span>
            <span className="text-xs text-muted-foreground">Records & EMR</span>
          </Link>

          <Link
            href="/appointments"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card hover:bg-sky-500/10 hover:border-sky-500/40 transition-all duration-300 group text-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Calendar</span>
            <span className="text-xs text-muted-foreground">Scheduler</span>
          </Link>

          <Link
            href="/treatments"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 group text-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Dental Chart</span>
            <span className="text-xs text-muted-foreground">2D/3D Odontogram</span>
          </Link>

          <Link
            href="/billing"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 group text-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Receipt className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">GST Billing</span>
            <span className="text-xs text-muted-foreground">Invoices & UPI</span>
          </Link>

          <Link
            href="/video"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card hover:bg-violet-500/10 hover:border-violet-500/40 transition-all duration-300 group text-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <Video className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Tele-Consult</span>
            <span className="text-xs text-muted-foreground">Virtual Visit</span>
          </Link>

          <Link
            href="/reports"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-300 group text-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-semibold text-sm">Analytics</span>
            <span className="text-xs text-muted-foreground">Reports & Audit</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
