'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getNavigationForRole } from '@/config/nav'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSidebar } from './sidebar-context'

interface SidebarProps {
  role: string
  hospitalName?: string
  hospitalLogo?: string | null
  plan?: string
}

export function Sidebar({ role, hospitalName, hospitalLogo, plan }: SidebarProps) {
  const pathname = usePathname()
  const navigation = getNavigationForRole(role)
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'flex h-full flex-col border-r bg-card transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header with Logo and Toggle */}
        <div
          className={cn(
            'flex h-16 items-center border-b',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          {/* Logo */}
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 transition-all duration-300',
              isCollapsed && 'justify-center'
            )}
          >
            {hospitalLogo ? (
              <img
                src={hospitalLogo}
                alt={hospitalName || 'Logo'}
                className="h-8 w-8 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                {hospitalName?.charAt(0) || 'D'}
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight truncate max-w-[140px]">
                  {hospitalName || 'Dental Clinic'}
                </span>
                {plan && (
                  <span
                    className={cn(
                      'text-[10px] leading-tight',
                      plan === 'FREE' ? 'text-muted-foreground' : 'text-primary'
                    )}
                  >
                    {plan === 'FREE'
                      ? 'Free Plan'
                      : plan === 'PROFESSIONAL'
                        ? 'Professional'
                        : plan === 'ENTERPRISE'
                          ? 'Enterprise'
                          : 'Self-Hosted'}
                  </span>
                )}
              </div>
            )}
          </Link>

          {/* Toggle Button - only show when expanded */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={toggleSidebar}
            >
              <PanelLeftClose className="h-4 w-4" />
              <span className="sr-only">Collapse sidebar</span>
            </Button>
          )}
        </div>

        {/* Toggle Button when collapsed - separate row */}
        {isCollapsed && (
          <div className="flex justify-center py-2 border-b">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={toggleSidebar}>
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Expand sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className={cn('flex flex-col gap-1 py-3', isCollapsed ? 'px-2' : 'px-3')}>
            {navigation.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? 'mt-4' : ''}>
                {/* Section Title - hidden when collapsed */}
                {!isCollapsed && (
                  <h4 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h4>
                )}
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                'flex h-10 w-full items-center justify-center rounded-xl transition-all duration-200',
                                isActive
                                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold shadow-sm border border-cyan-500/30'
                                  : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center gap-2 font-medium">
                            {item.title}
                            {item.badge && (
                              <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-xs text-slate-950 font-bold">
                                {item.badge}
                              </span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      )
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex h-10 items-center gap-3 rounded-xl px-3.5 text-sm transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-indigo-500/5 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20 shadow-sm'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                        )}
                      >
                        <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-cyan-500')} />
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className={cn('border-t py-3 text-center', isCollapsed ? 'px-2' : 'px-4')}>
          <p className="text-[10px] text-muted-foreground">
            {isCollapsed ? 'v1.0' : 'Dental ERP v1.0'}
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
