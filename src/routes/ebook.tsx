import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/ebook')({
  component: EbookPage,
});

interface Chapter {
  number: number;
  title: string;
  sections: string[];
  keyPoints: string[];
}

function EbookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [style, setStyle] = useState<'professional' | 'casual' | 'academic' | 'narrative'>('professional');
  const [format, setFormat] = useState<'pdf' | 'docx' | 'epub'>('pdf');
  const [chapters, setChapters] = useState<Chapter[]>([
    { number: 1, title: '', sections: [''], keyPoints: [''] },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ebookId, setEbookId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  const addChapter = () => {
    setChapters([
      ...chapters,
      { number: chapters.length + 1, title: '', sections: [''], keyPoints: [''] },
    ]);
  };

  const updateChapter = (index: number, field: keyof Chapter, value: any) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], [field]: value };
    setChapters(updated);
  };

  const addSection = (chapterIndex: number) => {
    const updated = [...chapters];
    updated[chapterIndex].sections.push('');
    setChapters(updated);
  };

  const updateSection = (chapterIndex: number, sectionIndex: number, value: string) => {
    const updated = [...chapters];
    updated[chapterIndex].sections[sectionIndex] = value;
    setChapters(updated);
  };

  const generateEbook = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/trpc/ebook.create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          title,
          outline: {
            title,
            author,
            chapters,
            style,
            targetLength: 1500,
          },
          format,
        }),
      });
      const data = await response.json();
      setEbookId(data.result.data.ebookId);
      pollStatus(data.result.data.ebookId);
    } catch (error) {
      console.error('Failed to generate eBook:', error);
      setIsGenerating(false);
    }
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/trpc/ebook.get?input=${encodeURIComponent(JSON.stringify({ id }))}`);
        const data = await response.json();
        setStatus(data.result.data);

        if (data.result.data.status === 'completed' || data.result.data.status === 'failed') {
          clearInterval(interval);
          setIsGenerating(false);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 eBook Machine</h1>
        <p>AI-powered eBook generation from outlines to finished documents</p>
      </div>

      <div className="card">
        <h2>eBook Configuration</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">eBook Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Complete Guide to..."
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your Name"
              className="input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="style">Writing Style</label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="select"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
              <option value="narrative">Narrative</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="format">Export Format</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="select"
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX (Word)</option>
              <option value="epub">EPUB</option>
            </select>
          </div>
        </div>

        <h3>Chapters</h3>
        {chapters.map((chapter, chIndex) => (
          <div key={chIndex} className="chapter-editor">
            <h4>Chapter {chapter.number}</h4>

            <div className="form-group">
              <label>Chapter Title</label>
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => updateChapter(chIndex, 'title', e.target.value)}
                placeholder="Introduction"
                className="input"
              />
            </div>

            <div className="form-group">
              <label>Sections</label>
              {chapter.sections.map((section, sIndex) => (
                <input
                  key={sIndex}
                  type="text"
                  value={section}
                  onChange={(e) => updateSection(chIndex, sIndex, e.target.value)}
                  placeholder={`Section ${sIndex + 1}`}
                  className="input"
                  style={{ marginBottom: '0.5rem' }}
                />
              ))}
              <button
                onClick={() => addSection(chIndex)}
                className="button btn-secondary btn-small"
              >
                + Add Section
              </button>
            </div>
          </div>
        ))}

        <button onClick={addChapter} className="button btn-secondary">
          + Add Chapter
        </button>

        <button
          onClick={generateEbook}
          disabled={!title || chapters.length === 0 || isGenerating}
          className="button btn-primary"
          style={{ marginLeft: '1rem' }}
        >
          {isGenerating ? 'Generating...' : 'Generate eBook'}
        </button>
      </div>

      {status && (
        <div className="card">
          <h2>Generation Status</h2>
          <div className="status-display">
            <div className={`status-badge ${status.status}`}>
              {status.status}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${status.progress}%` }} />
            </div>
            <p className="progress-text">{status.progress}% complete</p>
          </div>

          {status.status === 'completed' && (
            <div className="success-message">
              <p>✓ eBook generated successfully!</p>
              <p>File: {status.fileUrl}</p>
              <button className="button btn-primary">
                Download {format.toUpperCase()}
              </button>
            </div>
          )}

          {status.status === 'failed' && (
            <div className="error-message">
              <strong>Error:</strong> {status.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
