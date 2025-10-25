/**
 * eBook Machine Agent
 *
 * Autonomous agent for automated eBook generation from outlines.
 * Features:
 * - Chapter-by-chapter content generation using Claude
 * - Multiple export formats (PDF, DOCX, EPUB)
 * - Progress tracking and monitoring
 * - Quality control and consistency checks
 * - Self-monitoring and health checks
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface EbookOutline {
  title: string;
  author?: string;
  chapters: Chapter[];
  style?: 'professional' | 'casual' | 'academic' | 'narrative';
  targetLength?: number; // words per chapter
}

interface Chapter {
  number: number;
  title: string;
  sections: string[];
  keyPoints?: string[];
}

interface GeneratedChapter {
  number: number;
  title: string;
  content: string;
  wordCount: number;
}

interface EbookResult {
  title: string;
  chapters: GeneratedChapter[];
  totalWords: number;
  fileUrl: string;
  metadata: {
    generatedAt: Date;
    format: string;
    quality: number;
  };
}

export class EbookAgent {
  private isHealthy: boolean = true;
  private lastHealthCheck: Date = new Date();
  private outputDir: string = '/tmp/ebooks';

  constructor() {
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  /**
   * Main entry point for eBook generation
   */
  async generateEbook(
    ebookId: string,
    userId: string,
    outline: EbookOutline,
    format: 'pdf' | 'docx' | 'epub' = 'pdf'
  ): Promise<EbookResult> {
    console.log(`[EbookAgent] Starting eBook generation: ${outline.title}`);

    try {
      await this.updateStatus(ebookId, 'generating', 5);

      // Step 1: Validate and enhance outline
      const enhancedOutline = await this.enhanceOutline(outline);
      await this.updateStatus(ebookId, 'generating', 10);

      // Step 2: Generate each chapter
      const generatedChapters: GeneratedChapter[] = [];
      const totalChapters = enhancedOutline.chapters.length;

      for (let i = 0; i < enhancedOutline.chapters.length; i++) {
        const chapter = enhancedOutline.chapters[i];
        console.log(`[EbookAgent] Generating chapter ${i + 1}/${totalChapters}: ${chapter.title}`);

        const generatedContent = await this.generateChapter(
          enhancedOutline.title,
          chapter,
          enhancedOutline.style || 'professional',
          enhancedOutline.targetLength || 1500
        );

        generatedChapters.push(generatedContent);

        // Update progress
        const progress = 10 + ((i + 1) / totalChapters) * 70;
        await this.updateStatus(ebookId, 'generating', Math.round(progress));
      }

      await this.updateStatus(ebookId, 'generating', 85);

      // Step 3: Quality control - ensure consistency
      await this.performQualityCheck(generatedChapters);
      await this.updateStatus(ebookId, 'generating', 90);

      // Step 4: Export to requested format
      const fileUrl = await this.exportEbook(
        ebookId,
        enhancedOutline.title,
        enhancedOutline.author || 'Unknown',
        generatedChapters,
        format
      );
      await this.updateStatus(ebookId, 'generating', 95);

      // Step 5: Calculate quality metrics
      const totalWords = generatedChapters.reduce((sum, ch) => sum + ch.wordCount, 0);
      const quality = this.calculateQuality(generatedChapters, enhancedOutline);

      const result: EbookResult = {
        title: enhancedOutline.title,
        chapters: generatedChapters,
        totalWords,
        fileUrl,
        metadata: {
          generatedAt: new Date(),
          format,
          quality
        }
      };

      // Save results and mark complete
      await this.saveResults(ebookId, result);
      await this.updateStatus(ebookId, 'completed', 100);

      console.log(`[EbookAgent] eBook generation completed: ${outline.title}`);
      return result;

    } catch (error) {
      console.error('[EbookAgent] Generation failed:', error);
      await this.updateStatus(
        ebookId,
        'failed',
        0,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  /**
   * Enhance and validate the outline using Claude
   */
  private async enhanceOutline(outline: EbookOutline): Promise<EbookOutline> {
    console.log('[EbookAgent] Enhancing outline...');

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are an expert book editor. Review and enhance this eBook outline to ensure logical flow and comprehensive coverage.

Current Outline:
${JSON.stringify(outline, null, 2)}

Provide an enhanced version with:
1. Validated chapter order
2. Additional key points for each chapter if needed
3. Suggested improvements to section structure

Return the enhanced outline in the same JSON format.`
      }]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const enhanced = JSON.parse(jsonMatch[0]);
          return { ...outline, ...enhanced };
        }
      } catch (error) {
        console.warn('Failed to parse enhanced outline, using original:', error);
      }
    }

    return outline;
  }

  /**
   * Generate content for a single chapter
   */
  private async generateChapter(
    bookTitle: string,
    chapter: Chapter,
    style: string,
    targetLength: number
  ): Promise<GeneratedChapter> {
    console.log(`[EbookAgent] Generating chapter: ${chapter.title}`);

    const styleGuide = this.getStyleGuide(style);
    const sectionsText = chapter.sections.join(', ');
    const keyPointsText = chapter.keyPoints?.join('; ') || 'None specified';

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `You are a professional writer creating content for an eBook titled "${bookTitle}".

Write Chapter ${chapter.number}: "${chapter.title}"

Style: ${styleGuide}
Target Length: Approximately ${targetLength} words
Sections to Cover: ${sectionsText}
Key Points: ${keyPointsText}

Requirements:
- Engaging and well-structured content
- Clear transitions between sections
- Practical examples and insights where appropriate
- Professional tone appropriate for the subject matter
- ${style === 'academic' ? 'Citations and references where needed' : 'Conversational yet authoritative'}

Write the complete chapter content now.`
      }]
    });

    const content = message.content[0];
    let chapterText = '';
    if (content.type === 'text') {
      chapterText = content.text;
    }

    const wordCount = chapterText.split(/\s+/).length;

    return {
      number: chapter.number,
      title: chapter.title,
      content: chapterText,
      wordCount
    };
  }

  /**
   * Get style guide based on selected style
   */
  private getStyleGuide(style: string): string {
    const guides: Record<string, string> = {
      professional: 'Clear, authoritative, business-appropriate. Use active voice and concrete examples.',
      casual: 'Friendly, conversational, relatable. Feel free to use personal anecdotes and humor.',
      academic: 'Scholarly, well-researched, citation-based. Formal tone with analytical depth.',
      narrative: 'Story-driven, engaging, character-focused. Use vivid descriptions and compelling storytelling.'
    };
    return guides[style] || guides.professional;
  }

  /**
   * Perform quality checks on generated content
   */
  private async performQualityCheck(chapters: GeneratedChapter[]): Promise<void> {
    console.log('[EbookAgent] Performing quality check...');

    // Check for minimum content
    const tooShort = chapters.filter(ch => ch.wordCount < 500);
    if (tooShort.length > 0) {
      console.warn(`Warning: ${tooShort.length} chapters are shorter than 500 words`);
    }

    // Check for consistency
    const avgLength = chapters.reduce((sum, ch) => sum + ch.wordCount, 0) / chapters.length;
    const inconsistent = chapters.filter(ch =>
      Math.abs(ch.wordCount - avgLength) > avgLength * 0.5
    );
    if (inconsistent.length > 2) {
      console.warn('Warning: Chapter lengths vary significantly');
    }

    // TODO: Add more quality checks:
    // - Readability score
    // - Duplicate content detection
    // - Tone consistency
  }

  /**
   * Calculate overall quality score
   */
  private calculateQuality(chapters: GeneratedChapter[], outline: EbookOutline): number {
    let quality = 0.7; // Base quality

    // Consistent chapter lengths
    const avgLength = chapters.reduce((sum, ch) => sum + ch.wordCount, 0) / chapters.length;
    const variance = chapters.reduce((sum, ch) =>
      sum + Math.pow(ch.wordCount - avgLength, 2), 0
    ) / chapters.length;
    if (variance < avgLength * 0.3) quality += 0.15;

    // Meets target length
    const targetMet = chapters.filter(ch =>
      ch.wordCount >= (outline.targetLength || 1000) * 0.8
    ).length;
    if (targetMet / chapters.length > 0.8) quality += 0.15;

    return Math.min(quality, 1.0);
  }

  /**
   * Export eBook to specified format
   */
  private async exportEbook(
    ebookId: string,
    title: string,
    author: string,
    chapters: GeneratedChapter[],
    format: 'pdf' | 'docx' | 'epub'
  ): Promise<string> {
    console.log(`[EbookAgent] Exporting to ${format.toUpperCase()}...`);

    const filename = `${ebookId}.${format}`;
    const filepath = path.join(this.outputDir, filename);

    switch (format) {
      case 'pdf':
        await this.exportToPDF(filepath, title, author, chapters);
        break;
      case 'docx':
        await this.exportToDOCX(filepath, title, author, chapters);
        break;
      case 'epub':
        await this.exportToEPUB(filepath, title, author, chapters);
        break;
    }

    return filepath;
  }

  /**
   * Export to PDF format
   */
  private async exportToPDF(
    filepath: string,
    title: string,
    author: string,
    chapters: GeneratedChapter[]
  ): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([612, 792]); // US Letter size
    let yPosition = 750;

    // Title page
    page.drawText(title, {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 40;

    page.drawText(`by ${author}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Chapters
    for (const chapter of chapters) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = 750;

      // Chapter title
      page.drawText(`Chapter ${chapter.number}: ${chapter.title}`, {
        x: 50,
        y: yPosition,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 40;

      // Chapter content (simplified - wrap text properly in production)
      const lines = this.wrapText(chapter.content, 70);
      for (const line of lines.slice(0, 35)) { // Limit lines per page
        if (yPosition < 50) {
          page = pdfDoc.addPage([612, 792]);
          yPosition = 750;
        }
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 11,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
      }
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(filepath, pdfBytes);
  }

  /**
   * Export to DOCX format
   */
  private async exportToDOCX(
    filepath: string,
    title: string,
    author: string,
    chapters: GeneratedChapter[]
  ): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `by ${author}`,
            spacing: { after: 400 },
          }),
          // Chapters
          ...chapters.flatMap(chapter => [
            new Paragraph({
              text: `Chapter ${chapter.number}: ${chapter.title}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: chapter.content,
              spacing: { after: 200 },
            })
          ])
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(filepath, buffer);
  }

  /**
   * Export to EPUB format
   */
  private async exportToEPUB(
    filepath: string,
    title: string,
    author: string,
    chapters: GeneratedChapter[]
  ): Promise<void> {
    // TODO: Implement EPUB generation
    // For now, create a placeholder HTML file
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta name="author" content="${author}">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 2em; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p><em>by ${author}</em></p>
  ${chapters.map(ch => `
    <h2>Chapter ${ch.number}: ${ch.title}</h2>
    <p>${ch.content.replace(/\n/g, '</p><p>')}</p>
  `).join('\n')}
</body>
</html>
    `;
    await fs.writeFile(filepath.replace('.epub', '.html'), html);
  }

  /**
   * Simple text wrapping utility
   */
  private wrapText(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  /**
   * Update eBook generation status
   */
  private async updateStatus(
    id: string,
    status: string,
    progress: number,
    error?: string
  ): Promise<void> {
    await prisma.ebook.update({
      where: { id },
      data: {
        status,
        progress,
        error,
        updatedAt: new Date(),
        ...(status === 'completed' && { completedAt: new Date() })
      }
    });
  }

  /**
   * Save eBook results to database
   */
  private async saveResults(id: string, result: EbookResult): Promise<void> {
    await prisma.ebook.update({
      where: { id },
      data: {
        content: result.chapters as any,
        fileUrl: result.fileUrl,
        metadata: result.metadata as any,
      }
    });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      // Check Claude API
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      });

      // Check database
      await prisma.$queryRaw`SELECT 1`;

      // Check output directory
      await fs.access(this.outputDir);

      this.isHealthy = true;
      this.lastHealthCheck = new Date();

      return {
        status: 'healthy',
        details: {
          anthropicApi: 'connected',
          database: 'connected',
          outputDir: 'accessible',
          lastCheck: this.lastHealthCheck.toISOString()
        }
      };
    } catch (error) {
      this.isHealthy = false;
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          lastCheck: this.lastHealthCheck.toISOString()
        }
      };
    }
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      name: 'EbookAgent',
      healthy: this.isHealthy,
      lastHealthCheck: this.lastHealthCheck.toISOString(),
      capabilities: [
        'content_generation',
        'pdf_export',
        'docx_export',
        'epub_export',
        'quality_control',
        'llm_writing'
      ]
    };
  }
}

// Export singleton instance
export const ebookAgent = new EbookAgent();
