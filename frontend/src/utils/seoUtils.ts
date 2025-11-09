export interface SitemapUrl {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  // Add static pages
  addStaticPages() {
    const staticPages: SitemapUrl[] = [
      {
        url: this.baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 1.0
      },
      {
        url: `${this.baseUrl}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/portfolio`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9
      },
      {
        url: `${this.baseUrl}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7
      }
    ];

    this.urls.push(...staticPages);
    return this;
  }

  // Add blog posts
  addBlogPosts(posts: any[]) {
    const blogUrls: SitemapUrl[] = posts.map(post => ({
      url: `${this.baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }));

    this.urls.push(...blogUrls);
    return this;
  }

  // Add portfolio projects
  addPortfolioProjects(projects: any[]) {
    const portfolioUrls: SitemapUrl[] = projects.map(project => ({
      url: `${this.baseUrl}/portfolio/${project.slug || project._id}`,
      lastModified: project.updatedAt || project.createdAt || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));

    this.urls.push(...portfolioUrls);
    return this;
  }

  // Generate XML sitemap
  generateXML(): string {
    const urlElements = this.urls.map(urlObj => {
      return `  <url>
    <loc>${urlObj.url}</loc>
    ${urlObj.lastModified ? `<lastmod>${urlObj.lastModified}</lastmod>` : ''}
    ${urlObj.changeFrequency ? `<changefreq>${urlObj.changeFrequency}</changefreq>` : ''}
    ${urlObj.priority !== undefined ? `<priority>${urlObj.priority}</priority>` : ''}
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /.env

# Allow specific important pages
Allow: /
Allow: /about
Allow: /portfolio
Allow: /blog
Allow: /contact

# Block common non-content files
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /node_modules/
Disallow: /src/`;
  }
}

// Utility to generate meta description from content
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  if (!content) return '';
  
  // Remove HTML tags if present
  const textOnly = content.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  const cleaned = textOnly.replace(/\s+/g, ' ').trim();
  
  // Truncate to maxLength
  if (cleaned.length <= maxLength) return cleaned;
  
  // Find the last complete word before maxLength
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

// Utility to extract keywords from content
export const extractKeywords = (content: string, maxKeywords: number = 10): string[] => {
  if (!content) return [];
  
  // Remove HTML tags and convert to lowercase
  const textOnly = content.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Split into words and filter out common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);
  
  const words = textOnly
    .split(/\W+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter(word => /^[a-zA-Z]+$/.test(word)); // Only alphabetic words
  
  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// Utility to generate Open Graph image URL (for dynamic OG images)
export const generateOGImageUrl = (
  title: string, 
  subtitle?: string, 
  baseUrl: string = window.location.origin
): string => {
  const params = new URLSearchParams({
    title,
    ...(subtitle && { subtitle })
  });
  
  return `${baseUrl}/api/og-image?${params.toString()}`;
};