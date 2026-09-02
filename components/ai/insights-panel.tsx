'use client'

import { useEffect } from 'react'
import { useAI, type Insight } from './ai-provider'
import { cn } from '@/lib/utils'
import { Sparkles, RefreshCw, X, TrendingUp, AlertTriangle, Package, Users, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SEVERITY_STYLES: Record<string, string> = {
  INFO: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-900 dark:text-cyan-200',
  WARNING: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
  CRITICAL: 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200',
}

const SEVERITY_BADGE: Record<string, string> = {
  INFO: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  WARNING: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  CRITICAL: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
}

const CATEGORY_ICONS: Record<string, any> = {
  REVENUE: TrendingUp,
  CLINICAL: ShieldAlert,
  OPERATIONAL: Sparkles,
  PATIENT: Users,
  INVENTORY: Package,
}

const MOCK_DEMO_INSIGHTS: Insight[] = [
  {
    id: 'demo-insight-1',
    category: 'REVENUE',
    title: 'Prophylaxis Recall Opportunity',
    description:
      '18 active patients are due for 6-month dental scaling. Automated WhatsApp reminders can capture ~₹27,000 in upcoming hygiene revenue.',
    severity: 'INFO',
    dismissed: false,
    actionTaken: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-insight-2',
    category: 'INVENTORY',
    title: 'Automated Stock Replenishment',
    description:
      'Nitrile Gloves (Medium) & Local Anesthetic cartridges are reaching minimum safety thresholds. Purchase Order draft generated.',
    severity: 'WARNING',
    dismissed: false,
    actionTaken: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-insight-3',
    category: 'CLINICAL',
    title: 'Endodontic Capacity Demand',
    description:
      'Root Canal Treatments surged by 24% this month. Recommend assigning 2 additional afternoon clinical slots to Dr. Abinauv.',
    severity: 'INFO',
    dismissed: false,
    actionTaken: false,
    createdAt: new Date().toISOString(),
  },
]

function InsightCard({ insight, onDismiss }: { insight: Insight; onDismiss: () => void }) {
  const IconComponent = CATEGORY_ICONS[insight.category] || Sparkles

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border p-4 backdrop-blur-md transition-all duration-300 hover:shadow-lg',
        SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.INFO
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm border border-border/50">
            <IconComponent className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold tracking-tight text-foreground">{insight.title}</h4>
              <span
                className={cn(
                  'text-[10px] font-extrabold uppercase tracking-wider rounded-full px-2 py-0.5 border',
                  SEVERITY_BADGE[insight.severity] || SEVERITY_BADGE.INFO
                )}
              >
                {insight.severity}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-background/50"
          aria-label="Dismiss insight"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function InsightsPanel({ maxItems = 3 }: { maxItems?: number }) {
  const { insights, insightsLoading, loadInsights, dismissInsight, generateInsights } = useAI()

  useEffect(() => {
    loadInsights()
  }, [loadInsights])

  const activeInsights = insights && insights.length > 0 ? insights : MOCK_DEMO_INSIGHTS
  const visible = activeInsights.slice(0, maxItems)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="ai-badge">
            <Sparkles className="h-3 w-3 text-cyan-500 animate-pulse" />
            AI CLINICAL COPILOT
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateInsights}
          className="h-8 text-xs text-muted-foreground hover:text-primary gap-1.5"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', insightsLoading && 'animate-spin')} />
          Re-Analyze Practice Data
        </Button>
      </div>

      {/* Loading State */}
      {insightsLoading && (
        <div className="flex items-center gap-3 p-4 text-xs font-semibold text-muted-foreground rounded-xl bg-muted/40 animate-pulse">
          <Sparkles className="h-4 w-4 animate-spin text-cyan-500" />
          <span>Analyzing practice telemetry & generating AI insights…</span>
        </div>
      )}

      {/* Insight Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
        {visible.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onDismiss={() => dismissInsight(insight.id)}
          />
        ))}
      </div>
    </div>
  )
}
