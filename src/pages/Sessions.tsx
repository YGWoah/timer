import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getFocusSessionsForUser } from '@/services/focusSessions'
import type { FocusSession } from '@/entities/focusSession'
import { relativeTime } from '@/utils/relative'
import SEO from '@/components/SEO'

// Shadcn UI Chart components
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

type FocusSessionWithId = FocusSession & { id: string }

// Define chart configuration
const chartConfig = {
  duration: {
    label: 'Duration',
    color: 'hsl(var(--chart-1))', // Assuming chart-1 is defined in your CSS/theme
  },
} satisfies ChartConfig

export default function SessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<FocusSessionWithId[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getFocusSessionsForUser(user.uid)
      .then((s) => setSessions(s))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [user])

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  // Process sessions data for the chart
  const chartData = useMemo(() => {
    const dailyDurations: { [key: string]: number } = {}

    sessions.forEach((session) => {
      if (session.startTime && session.durationSeconds != null) {
        const date = new Date(session.startTime)
        // Format date as YYYY-MM-DD for grouping
        const dateKey = date.toISOString().split('T')[0]
        dailyDurations[dateKey] = (dailyDurations[dateKey] || 0) + session.durationSeconds
      }
    })

    // Convert to an array of objects for the chart
    const data = Object.keys(dailyDurations).map((dateKey) => ({
      date: dateKey,
      // Convert total seconds to minutes for the chart
      duration: dailyDurations[dateKey] / 60,
    }))

    // Sort data by date
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [sessions])

  return (
    <>
      <SEO 
        title="Sessions History - FocusTimer | Track Your Productivity Progress"
        description="View your focus session history, analyze productivity patterns, and monitor your work progress over time with detailed charts and statistics."
        keywords="session history, productivity analytics, focus session tracking, work progress, time analytics"
      />
      <main className="min-h-screen bg-gray-50 py-8" role="main">
        <div className="max-w-4xl mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Focus Sessions</h1>
          </header>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading sessions...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No sessions yet</div>
            <p className="text-gray-600">Start your first focus session from the dashboard!</p>
          </div>
        )}

        {/* Chart Section */}
        {chartData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Focus Duration</h3>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    // Format date for display on X-axis (e.g., "Sep 23")
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis
                  dataKey="duration"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `${value}m`} // Label Y-axis in minutes
                />
                <ChartTooltip content={<ChartTooltipContent />} formatter={(value: number) => `${value.toFixed(0)} minutes`}/>
                <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        )}

        {/* Existing Sessions Table */}
        {sessions.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((s, index) => (
                  <tr key={s.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{s.topic}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {s.durationSeconds != null ? formatDuration(s.durationSeconds) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900"
                        title={s.startTime ? new Date(s.startTime).toLocaleString() : ''}
                      >
                        {s.startTime ? relativeTime(s.startTime) : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>
    </>
  )
}