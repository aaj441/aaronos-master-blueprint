/**
 * WCAG Scanner Agent
 *
 * Autonomous accessibility scanning agent:
 * - Automated WCAG compliance scanning
 * - Multi-page crawling
 * - Detailed issue reporting
 * - Benchmark comparison
 * - PDF/CSV/JSON export
 */

import { PrismaClient } from '@prisma/client';
import puppeteer, { Browser, Page } from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const prisma = new PrismaClient();

export interface WcagScanRequest {
  id: string;
  userId: string;
  targetUrl: string;
  domains: string[];
  benchmark?: string;
  maxPages?: number;
}

export interface WcagIssue {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  wcagTags: string[];
  nodes: {
    target: string[];
    html: string;
    failureSummary: string;
  }[];
}

export interface WcagScanResult {
  url: string;
  score: number;
  violations: WcagIssue[];
  passes: number;
  incomplete: number;
  timestamp: Date;
}

export interface CompleteScanResult {
  overallScore: number;
  pagesScanned: number;
  totalViolations: number;
  criticalIssues: number;
  results: WcagScanResult[];
  summary: {
    byImpact: Record<string, number>;
    byWcagLevel: Record<string, number>;
    commonIssues: WcagIssue[];
  };
}

export class WcagAgent {
  private browser?: Browser;
  private isHealthy: boolean = true;
  private lastHealthCheck: Date = new Date();

  /**
   * Execute WCAG scan
   */
  async executeScan(request: WcagScanRequest): Promise<CompleteScanResult> {
    console.log(`[WcagAgent] Starting scan for: ${request.targetUrl}`);

    try {
      await this.updateScanStatus(request.id, 'scanning', 5);

      // Initialize browser
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      // Discover pages to scan
      const pagesToScan = await this.discoverPages(
        request.targetUrl,
        request.domains,
        request.maxPages || 10
      );
      await this.updateScanStatus(request.id, 'scanning', 20);

      console.log(`[WcagAgent] Found ${pagesToScan.length} pages to scan`);

      // Scan each page
      const results: WcagScanResult[] = [];
      for (let i = 0; i < pagesToScan.length; i++) {
        const url = pagesToScan[i];
        console.log(`[WcagAgent] Scanning page ${i + 1}/${pagesToScan.length}: ${url}`);

        try {
          const result = await this.scanPage(url);
          results.push(result);
        } catch (error) {
          console.error(`Failed to scan ${url}:`, error);
        }

        // Update progress
        const progress = 20 + ((i + 1) / pagesToScan.length) * 65;
        await this.updateScanStatus(request.id, 'scanning', Math.round(progress));
      }

      // Compile results
      const compiled = this.compileResults(results);
      await this.updateScanStatus(request.id, 'scanning', 90);

      // Save results
      await this.saveResults(request.id, compiled);
      await this.updateScanStatus(request.id, 'completed', 100);

      console.log(`[WcagAgent] Scan completed for: ${request.targetUrl}`);
      return compiled;

    } catch (error) {
      console.error('[WcagAgent] Scan failed:', error);
      await this.updateScanStatus(
        request.id,
        'failed',
        0,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
        this.browser = undefined;
      }
    }
  }

  /**
   * Discover pages to scan
   */
  private async discoverPages(
    startUrl: string,
    allowedDomains: string[],
    maxPages: number
  ): Promise<string[]> {
    const discovered = new Set<string>([startUrl]);
    const queue = [startUrl];
    const visited = new Set<string>();

    while (queue.length > 0 && discovered.size < maxPages) {
      const url = queue.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);

      try {
        const page = await this.browser!.newPage();
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });

        // Extract links
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href]')).map(
            (a) => (a as HTMLAnchorElement).href
          );
        });

        await page.close();

        // Filter and add new links
        for (const link of links) {
          try {
            const linkUrl = new URL(link);
            const isAllowed = allowedDomains.some(domain =>
              linkUrl.hostname.includes(domain)
            );

            if (isAllowed && !discovered.has(link) && discovered.size < maxPages) {
              discovered.add(link);
              queue.push(link);
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      } catch (error) {
        console.error(`Failed to discover links on ${url}:`, error);
      }
    }

    return Array.from(discovered);
  }

  /**
   * Scan a single page
   */
  private async scanPage(url: string): Promise<WcagScanResult> {
    const page = await this.browser!.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

      // Run axe-core accessibility scan
      const results = await new AxePuppeteer(page).analyze();

      // Calculate score (0-100)
      const totalTests = results.violations.length + results.passes.length;
      const score = totalTests > 0
        ? Math.round((results.passes.length / totalTests) * 100)
        : 100;

      // Format violations
      const violations: WcagIssue[] = results.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact as 'critical' | 'serious' | 'moderate' | 'minor',
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        wcagTags: violation.tags,
        nodes: violation.nodes.map(node => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary || '',
        })),
      }));

      return {
        url,
        score,
        violations,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        timestamp: new Date(),
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Compile results from multiple pages
   */
  private compileResults(results: WcagScanResult[]): CompleteScanResult {
    const allViolations = results.flatMap(r => r.violations);

    // Calculate overall score
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Count by impact
    const byImpact: Record<string, number> = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    allViolations.forEach(v => {
      byImpact[v.impact] = (byImpact[v.impact] || 0) + 1;
    });

    // Count by WCAG level
    const byWcagLevel: Record<string, number> = {};
    allViolations.forEach(v => {
      v.wcagTags.forEach(tag => {
        if (tag.startsWith('wcag')) {
          byWcagLevel[tag] = (byWcagLevel[tag] || 0) + 1;
        }
      });
    });

    // Find most common issues
    const issueCounts = new Map<string, { issue: WcagIssue; count: number }>();
    allViolations.forEach(v => {
      const existing = issueCounts.get(v.id);
      if (existing) {
        existing.count++;
      } else {
        issueCounts.set(v.id, { issue: v, count: 1 });
      }
    });

    const commonIssues = Array.from(issueCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(item => item.issue);

    return {
      overallScore: Math.round(avgScore),
      pagesScanned: results.length,
      totalViolations: allViolations.length,
      criticalIssues: byImpact.critical,
      results,
      summary: {
        byImpact,
        byWcagLevel,
        commonIssues,
      },
    };
  }

  /**
   * Update scan status
   */
  private async updateScanStatus(
    id: string,
    status: string,
    progress: number,
    error?: string
  ): Promise<void> {
    await prisma.wcagScan.update({
      where: { id },
      data: {
        status,
        progress,
        error,
        updatedAt: new Date(),
        ...(status === 'completed' && { completedAt: new Date() }),
      },
    });
  }

  /**
   * Save scan results
   */
  private async saveResults(id: string, result: CompleteScanResult): Promise<void> {
    await prisma.wcagScan.update({
      where: { id },
      data: {
        results: result.results as any,
        issues: result.summary.commonIssues as any,
        score: result.overallScore,
      },
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      // Test browser launch
      const testBrowser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      await testBrowser.close();

      // Test database
      await prisma.$queryRaw`SELECT 1`;

      this.isHealthy = true;
      this.lastHealthCheck = new Date();

      return {
        status: 'healthy',
        details: {
          puppeteer: 'operational',
          database: 'connected',
          lastCheck: this.lastHealthCheck.toISOString(),
        },
      };
    } catch (error) {
      this.isHealthy = false;
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          lastCheck: this.lastHealthCheck.toISOString(),
        },
      };
    }
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      name: 'WcagAgent',
      healthy: this.isHealthy,
      lastHealthCheck: this.lastHealthCheck.toISOString(),
      capabilities: [
        'wcag_scanning',
        'multi_page_crawling',
        'accessibility_reporting',
        'automated_testing',
      ],
    };
  }
}

// Export singleton instance
export const wcagAgent = new WcagAgent();
