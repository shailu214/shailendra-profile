export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  robots?: string;
  viewport?: string;
  themeColor?: string;
  manifest?: string;
  favicon?: string;
  appleTouchIcon?: string;
}

export const generateMetaTags = (config: SEOConfig) => {
  const defaultConfig = {
    type: 'website' as const,
    locale: 'en_US',
    twitterCard: 'summary_large_image' as const,
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    themeColor: '#3B82F6',
    manifest: '/manifest.json',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
  };

  const finalConfig = { ...defaultConfig, ...config };
  const currentUrl = window.location.origin + window.location.pathname;

  return {
    // Basic Meta Tags
    title: finalConfig.title,
    description: finalConfig.description,
    keywords: finalConfig.keywords?.join(', '),
    author: finalConfig.author,
    robots: finalConfig.robots,
    viewport: finalConfig.viewport,
    canonical: finalConfig.canonical || currentUrl,

    // Open Graph Meta Tags
    ogTitle: finalConfig.title,
    ogDescription: finalConfig.description,
    ogImage: finalConfig.image,
    ogUrl: finalConfig.url || currentUrl,
    ogType: finalConfig.type,
    ogSiteName: finalConfig.siteName,
    ogLocale: finalConfig.locale,

    // Twitter Card Meta Tags
    twitterCard: finalConfig.twitterCard,
    twitterTitle: finalConfig.title,
    twitterDescription: finalConfig.description,
    twitterImage: finalConfig.image,
    twitterSite: finalConfig.twitterSite,
    twitterCreator: finalConfig.twitterCreator,

    // Article specific (for blog posts)
    articlePublishedTime: finalConfig.publishedTime,
    articleModifiedTime: finalConfig.modifiedTime,
    articleAuthor: finalConfig.author,
    articleSection: finalConfig.section,
    articleTags: finalConfig.tags,

    // Additional Meta Tags
    themeColor: finalConfig.themeColor,
    manifest: finalConfig.manifest,
    favicon: finalConfig.favicon,
    appleTouchIcon: finalConfig.appleTouchIcon,
  };
};

export const defaultSEO: SEOConfig = {
  title: 'Portfolio - Full Stack Developer',
  description: 'Professional portfolio showcasing full-stack development expertise, modern web technologies, and innovative projects.',
  keywords: [
    'Full Stack Developer',
    'React.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Web Development',
    'JavaScript',
    'Portfolio',
    'Frontend',
    'Backend'
  ],
  type: 'website',
  siteName: 'Developer Portfolio',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
};

// Page-specific SEO configurations
export const pageSEO = {
  home: (profile?: any, settings?: any): SEOConfig => ({
    title: `${profile?.basicInfo?.displayName || settings?.personal?.name || 'Portfolio'} - ${profile?.professional?.currentPosition?.title || settings?.personal?.title || 'Full Stack Developer'}`,
    description: `${profile?.basicInfo?.bio || settings?.personal?.bio || 'Professional developer'} - Expert in ${profile?.skills?.technical?.slice(0, 3).map((s: any) => s.name).join(', ') || 'web development and modern technologies'}`,
    keywords: [
      profile?.basicInfo?.firstName,
      profile?.basicInfo?.lastName,
      profile?.professional?.currentPosition?.title || 'Full Stack Developer',
      ...(profile?.skills?.technical?.slice(0, 5).map((s: any) => s.name) || []),
      'Web Development',
      'Portfolio'
    ].filter(Boolean),
    type: 'profile',
    author: profile?.basicInfo?.displayName || settings?.personal?.name,
    image: profile?.basicInfo?.avatar?.url,
    siteName: settings?.site?.name || 'Developer Portfolio',
  }),

  about: (profile?: any, settings?: any): SEOConfig => ({
    title: `About ${profile?.basicInfo?.displayName || settings?.personal?.name || 'Me'} - ${settings?.site?.name || 'Portfolio'}`,
    description: `Learn about ${profile?.basicInfo?.displayName || settings?.personal?.name || 'me'}, my journey as a ${profile?.professional?.currentPosition?.title || 'developer'}, and my ${profile?.professional?.yearsOfExperience || '5+'} years of experience in web development.`,
    keywords: [
      'About',
      profile?.basicInfo?.firstName,
      profile?.basicInfo?.lastName,
      'Developer Biography',
      'Experience',
      'Skills',
      ...(profile?.professional?.specializations?.map((s: any) => s.name) || [])
    ].filter(Boolean),
    type: 'profile',
    author: profile?.basicInfo?.displayName || settings?.personal?.name,
    image: profile?.basicInfo?.avatar?.url,
  }),

  portfolio: (settings?: any): SEOConfig => ({
    title: `Portfolio - ${settings?.site?.name || 'Projects & Work'}`,
    description: 'Explore my collection of web development projects, including full-stack applications, frontend designs, and technical solutions.',
    keywords: [
      'Portfolio',
      'Projects',
      'Web Development',
      'Case Studies',
      'React Projects',
      'Full Stack Applications',
      'Frontend',
      'Backend'
    ],
    type: 'website',
    siteName: settings?.site?.name,
  }),

  blog: (settings?: any): SEOConfig => ({
    title: `Blog - ${settings?.site?.name || 'Tech Articles & Insights'}`,
    description: 'Read my latest blog posts about web development, programming tutorials, tech insights, and industry best practices.',
    keywords: [
      'Blog',
      'Web Development',
      'Programming',
      'Tutorials',
      'Tech Articles',
      'JavaScript',
      'React',
      'Node.js',
      'Development Tips'
    ],
    type: 'website',
    siteName: settings?.site?.name,
  }),

  contact: (settings?: any): SEOConfig => ({
    title: `Contact - ${settings?.site?.name || 'Get in Touch'}`,
    description: 'Get in touch for collaboration opportunities, project inquiries, or professional consultations. Let\'s build something amazing together.',
    keywords: [
      'Contact',
      'Hire Developer',
      'Collaboration',
      'Project Inquiry',
      'Freelancer',
      'Consultation',
      'Web Development Services'
    ],
    type: 'website',
    siteName: settings?.site?.name,
  }),
};

// Dynamic SEO for blog posts
export const generateBlogPostSEO = (post: any, settings?: any): SEOConfig => ({
  title: `${post.seo?.metaTitle || post.title} - ${settings?.site?.name || 'Blog'}`,
  description: post.seo?.metaDescription || post.excerpt || `Read about ${post.title} and discover insights on ${post.category.toLowerCase()}.`,
  keywords: [
    ...(post.seo?.keywords || []),
    ...post.tags,
    post.category,
    'Blog Post',
    'Tutorial',
    'Web Development'
  ].filter(Boolean),
  type: 'article',
  author: post.author?.name || settings?.personal?.name,
  publishedTime: post.publishedAt || post.createdAt,
  modifiedTime: post.updatedAt,
  section: post.category,
  tags: post.tags,
  image: post.featuredImage,
  siteName: settings?.site?.name,
});

// Dynamic SEO for portfolio projects
export const generatePortfolioSEO = (project: any, settings?: any): SEOConfig => ({
  title: `${project.seo?.title || project.title} - ${settings?.site?.name || 'Portfolio'}`,
  description: project.seo?.description || project.description || `Discover ${project.title}, a ${project.category.toLowerCase()} project showcasing ${project.technologies?.slice(0, 3).join(', ')} technologies.`,
  keywords: [
    ...(project.seo?.keywords || []),
    ...project.technologies,
    project.category,
    'Portfolio Project',
    'Case Study',
    'Web Development'
  ].filter(Boolean),
  type: 'website',
  author: settings?.personal?.name,
  image: project.images?.[0] || project.featuredImage,
  siteName: settings?.site?.name,
});