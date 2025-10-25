import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/toaster'

export function EBookMachineModule() {
  const [outline, setOutline] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBook, setGeneratedBook] = useState<any>(null)
  const { addToast } = useToast()

  const templates = [
    {
      name: 'Business Guide',
      description: 'Step-by-step business process guide',
      icon: '💼',
      outline: 'Introduction\n\nChapter 1: Getting Started\n- Overview\n- Prerequisites\n- Setup\n\nChapter 2: Core Concepts\n- Key principles\n- Best practices\n- Common pitfalls\n\nChapter 3: Implementation\n- Step-by-step process\n- Tools and resources\n- Monitoring and optimization\n\nConclusion\n- Summary\n- Next steps\n- Additional resources'
    },
    {
      name: 'Technical Tutorial',
      description: 'Comprehensive technical learning resource',
      icon: '⚙️',
      outline: 'Introduction\n\nChapter 1: Fundamentals\n- Basic concepts\n- Terminology\n- Prerequisites\n\nChapter 2: Hands-on Practice\n- Setup environment\n- First example\n- Common patterns\n\nChapter 3: Advanced Topics\n- Complex scenarios\n- Performance optimization\n- Troubleshooting\n\nChapter 4: Real-world Applications\n- Case studies\n- Best practices\n- Industry examples\n\nConclusion\n- Key takeaways\n- Further learning\n- Community resources'
    },
    {
      name: 'Creative Writing',
      description: 'Fiction or creative non-fiction structure',
      icon: '✍️',
      outline: 'Prologue\n\nChapter 1: The Beginning\n- Character introduction\n- Setting establishment\n- Initial conflict\n\nChapter 2: Rising Action\n- Character development\n- Plot progression\n- Subplot introduction\n\nChapter 3: Climax\n- Main conflict resolution\n- Character transformation\n- Plot culmination\n\nChapter 4: Resolution\n- Loose ends tied\n- Character growth\n- Future implications\n\nEpilogue'
    }
  ]

  const handleGenerate = async () => {
    if (!outline.trim()) {
      addToast({
        title: 'Outline Required',
        description: 'Please provide an outline or select a template to generate your e-book.',
        type: 'warning'
      })
      return
    }

    setIsGenerating(true)
    
    // Simulate book generation
    setTimeout(() => {
      const wordCount = outline.split(' ').length * 150 // Rough estimate
      const pageCount = Math.ceil(wordCount / 250)
      
      setGeneratedBook({
        title: 'Generated E-Book',
        wordCount,
        pageCount,
        chapters: outline.split('\n\n').filter(section => section.trim().startsWith('Chapter')),
        outline: outline,
        generatedAt: new Date()
      })
      
      setIsGenerating(false)
      
      addToast({
        title: 'E-Book Generated',
        description: `Successfully generated ${pageCount} pages from your outline.`,
        type: 'success'
      })
    }, 3000)
  }

  const useTemplate = (templateOutline: string) => {
    setOutline(templateOutline)
    addToast({
      title: 'Template Applied',
      description: 'Template outline has been loaded. You can modify it as needed.',
      type: 'info'
    })
  }

  const exportBook = (format: 'pdf' | 'epub' | 'mobi' | 'html') => {
    addToast({
      title: 'Export Started',
      description: `Preparing ${format.toUpperCase()} export...`,
      type: 'info'
    })
    
    setTimeout(() => {
      addToast({
        title: 'Export Complete',
        description: `Your ${format.toUpperCase()} file is ready for download.`,
        type: 'success'
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">
          eBook Machine
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
          Transform your outlines into polished e-books with AI-powered content generation.
        </p>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Choose a Template</CardTitle>
          <CardDescription>
            Start with a pre-built outline or create your own from scratch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <span>{template.icon}</span>
                    <span>{template.name}</span>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => useTemplate(template.outline)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outline Input */}
      <Card>
        <CardHeader>
          <CardTitle>Your E-Book Outline</CardTitle>
          <CardDescription>
            Enter your outline below. Use clear chapter headings and bullet points for structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full h-64 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              placeholder="Enter your e-book outline here...

Example:
Introduction

Chapter 1: Getting Started
- Overview of the topic
- Why this matters
- What you'll learn

Chapter 2: Core Concepts
- Key principles
- Important definitions
- Common misconceptions

Conclusion
- Summary of key points
- Next steps
- Additional resources"
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-[var(--color-muted)]">
                {outline.split(' ').length} words • Estimated {Math.ceil(outline.split(' ').length * 150 / 250)} pages
              </div>
              <Button 
                onClick={handleGenerate} 
                loading={isGenerating}
                disabled={!outline.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate E-Book'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Book */}
      {generatedBook && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated E-Book</CardTitle>
                <CardDescription>
                  Your e-book has been generated successfully!
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportBook('pdf')}
                >
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportBook('epub')}
                >
                  Export EPUB
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportBook('mobi')}
                >
                  Export MOBI
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportBook('html')}
                >
                  Export HTML
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-[var(--color-input-bg)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-primary)]">
                  {generatedBook.pageCount}
                </div>
                <div className="text-sm text-[var(--color-muted)]">Pages</div>
              </div>
              <div className="text-center p-4 bg-[var(--color-input-bg)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-primary)]">
                  {generatedBook.wordCount.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--color-muted)]">Words</div>
              </div>
              <div className="text-center p-4 bg-[var(--color-input-bg)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-primary)]">
                  {generatedBook.chapters.length}
                </div>
                <div className="text-sm text-[var(--color-muted)]">Chapters</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-[var(--color-text)]">Table of Contents</h4>
              <div className="space-y-1">
                {generatedBook.chapters.map((chapter: string, index: number) => (
                  <div key={index} className="text-sm text-[var(--color-muted)] pl-4">
                    {chapter}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🤖</span>
              <span>AI Content Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted)]">
              Advanced AI creates engaging, well-structured content from your outline.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📱</span>
              <span>Multi-Format Export</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted)]">
              Export to PDF, EPUB, MOBI, and HTML for maximum compatibility.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>✏️</span>
              <span>Professional Formatting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-muted)]">
              Automatically formatted with proper typography, spacing, and layout.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}