import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/toaster'

export function LucyModule() {
  const [query, setQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const { addToast } = useToast()

  const handleResearch = async () => {
    if (!query.trim()) {
      addToast({
        title: 'Query Required',
        description: 'Please enter a research query to get started.',
        type: 'warning'
      })
      return
    }

    setIsAnalyzing(true)
    
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          id: 1,
          title: 'Market Analysis: ' + query,
          description: 'Comprehensive market analysis with competitor insights and trends.',
          confidence: 0.85,
          sources: 12,
          lastUpdated: new Date()
        },
        {
          id: 2,
          title: 'Competitor Landscape',
          description: 'Detailed breakdown of key competitors and their market positioning.',
          confidence: 0.92,
          sources: 8,
          lastUpdated: new Date()
        },
        {
          id: 3,
          title: 'Trend Analysis',
          description: 'Emerging trends and opportunities in the target market.',
          confidence: 0.78,
          sources: 15,
          lastUpdated: new Date()
        }
      ])
      setIsAnalyzing(false)
      
      addToast({
        title: 'Research Complete',
        description: `Found ${3} insights for "${query}"`,
        type: 'success'
      })
    }, 2000)
  }

  const exportResults = (format: 'pdf' | 'csv' | 'json') => {
    addToast({
      title: 'Export Started',
      description: `Preparing ${format.toUpperCase()} export...`,
      type: 'info'
    })
    
    // Simulate export
    setTimeout(() => {
      addToast({
        title: 'Export Complete',
        description: `Your ${format.toUpperCase()} file is ready for download.`,
        type: 'success'
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">
          Lucy Research Copilot
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
          AI-powered competitor analysis and market exploration. Get strategic insights in seconds.
        </p>
      </div>

      {/* Research Input */}
      <Card>
        <CardHeader>
          <CardTitle>Start Your Research</CardTitle>
          <CardDescription>
            Enter a company, industry, or topic to analyze. Lucy will gather comprehensive insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Input
                placeholder="e.g., 'Tesla competitors', 'SaaS market trends', 'AI startups'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleResearch} 
                loading={isAnalyzing}
                disabled={!query.trim()}
              >
                {isAnalyzing ? 'Analyzing...' : 'Research'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('Tesla competitors')}
              >
                Tesla competitors
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('SaaS market trends')}
              >
                SaaS trends
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery('AI startups')}
              >
                AI startups
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Research Results
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportResults('pdf')}
              >
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportResults('csv')}
              >
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportResults('json')}
              >
                Export JSON
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {result.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[var(--color-muted)]">
                        {Math.round(result.confidence * 100)}% confidence
                      </span>
                      <div className="w-16 h-2 bg-[var(--color-input-bg)] rounded-full">
                        <div 
                          className="h-2 bg-[var(--color-primary)] rounded-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
                    <span>{result.sources} sources</span>
                    <span>Updated {result.lastUpdated.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔍</span>
              <span>Market Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted)]">
              Comprehensive market sizing, growth trends, and competitive landscape analysis.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Competitor Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted)]">
              Deep dive into competitor strategies, pricing, features, and market positioning.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📈</span>
              <span>Trend Forecasting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted)]">
              AI-powered trend analysis and future market opportunity identification.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}