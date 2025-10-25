import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'
import { useTheme } from './ThemeProvider'

export function Dashboard() {
  const { theme } = useTheme()

  const modules = [
    {
      title: 'Lucy Research Copilot',
      description: 'AI-powered competitor analysis and market exploration',
      icon: '🔍',
      href: '/lucy',
      status: 'active',
      stats: { projects: 12, insights: 48 }
    },
    {
      title: 'eBook Machine',
      description: 'Automated e-book generation from outlines',
      icon: '📚',
      href: '/ebook-machine',
      status: 'active',
      stats: { books: 8, pages: 1200 }
    },
    {
      title: 'WCAG Scanner',
      description: 'Accessibility compliance testing and reporting',
      icon: '♿',
      href: '/scanner',
      status: 'beta',
      stats: { scans: 24, issues: 156 }
    },
    {
      title: 'Voice Resonance Coach',
      description: 'AI voice coaching for sales professionals',
      icon: '🎤',
      href: '/voice-coach',
      status: 'coming-soon',
      stats: { sessions: 0, improvements: 0 }
    }
  ]

  const recentActivity = [
    { action: 'Completed market analysis', module: 'Lucy', time: '2 hours ago' },
    { action: 'Generated e-book chapter', module: 'eBook Machine', time: '4 hours ago' },
    { action: 'Ran accessibility scan', module: 'WCAG Scanner', time: '1 day ago' },
    { action: 'Updated research template', module: 'Lucy', time: '2 days ago' }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">
          Welcome to AaronOS v5
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
          Your unified dashboard for research, content creation, and accessibility testing.
          Choose a module below to get started.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <Card key={module.title} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{module.icon}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  module.status === 'active' ? 'bg-green-100 text-green-800' :
                  module.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {module.status}
                </span>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Projects</span>
                  <span className="font-medium">{module.stats.projects || module.stats.books || module.stats.scans || module.stats.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Output</span>
                  <span className="font-medium">{module.stats.insights || module.stats.pages || module.stats.issues || module.stats.improvements}</span>
                </div>
                <Link to={module.href}>
                  <Button 
                    className="w-full" 
                    disabled={module.status === 'coming-soon'}
                  >
                    {module.status === 'coming-soon' ? 'Coming Soon' : 'Open Module'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions across all modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {activity.action}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {activity.module} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/lucy">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <span className="text-2xl">🔍</span>
                <span>Start Research</span>
              </Button>
            </Link>
            <Link to="/ebook-machine">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <span className="text-2xl">📚</span>
                <span>Create eBook</span>
              </Button>
            </Link>
            <Link to="/scanner">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <span className="text-2xl">♿</span>
                <span>Scan Website</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}