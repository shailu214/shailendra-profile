import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { SEOConfig } from '../utils/metaTags';
import { generateMetaTags } from '../utils/metaTags';

interface SEOHelmetProps {
  config: SEOConfig;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({ config }) => {
  const metaTags = generateMetaTags(config);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      {metaTags.keywords && <meta name="keywords" content={metaTags.keywords} />}
      {metaTags.author && <meta name="author" content={metaTags.author} />}
      <meta name="robots" content={metaTags.robots} />
      <meta name="viewport" content={metaTags.viewport} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaTags.canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaTags.ogTitle} />
      <meta property="og:description" content={metaTags.ogDescription} />
      <meta property="og:type" content={metaTags.ogType} />
      <meta property="og:url" content={metaTags.ogUrl} />
      {metaTags.ogImage && <meta property="og:image" content={metaTags.ogImage} />}
      {metaTags.ogImage && <meta property="og:image:alt" content={`${metaTags.title} - Preview Image`} />}
      {metaTags.ogSiteName && <meta property="og:site_name" content={metaTags.ogSiteName} />}
      <meta property="og:locale" content={metaTags.ogLocale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={metaTags.twitterCard} />
      <meta name="twitter:title" content={metaTags.twitterTitle} />
      <meta name="twitter:description" content={metaTags.twitterDescription} />
      {metaTags.twitterImage && <meta name="twitter:image" content={metaTags.twitterImage} />}
      {metaTags.twitterSite && <meta name="twitter:site" content={metaTags.twitterSite} />}
      {metaTags.twitterCreator && <meta name="twitter:creator" content={metaTags.twitterCreator} />}

      {/* Article Meta Tags (for blog posts) */}
      {metaTags.ogType === 'article' && (
        <>
          {metaTags.articlePublishedTime && (
            <meta property="article:published_time" content={metaTags.articlePublishedTime} />
          )}
          {metaTags.articleModifiedTime && (
            <meta property="article:modified_time" content={metaTags.articleModifiedTime} />
          )}
          {metaTags.articleAuthor && (
            <meta property="article:author" content={metaTags.articleAuthor} />
          )}
          {metaTags.articleSection && (
            <meta property="article:section" content={metaTags.articleSection} />
          )}
          {metaTags.articleTags?.map((tag: string, index: number) => (
            <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content={metaTags.themeColor} />
      <link rel="manifest" href={metaTags.manifest} />
      <link rel="icon" href={metaTags.favicon} />
      <link rel="apple-touch-icon" href={metaTags.appleTouchIcon} />

      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content={metaTags.themeColor} />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* JSON-LD Structured Data */}
      {metaTags.ogType === 'profile' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": metaTags.author,
            "jobTitle": config.description?.split(' - ')[1] || "Full Stack Developer",
            "url": metaTags.ogUrl,
            "image": metaTags.ogImage,
            "sameAs": config.twitterCreator ? [`https://twitter.com/${config.twitterCreator}`] : [],
            "worksFor": {
              "@type": "Organization",
              "name": metaTags.ogSiteName
            }
          })}
        </script>
      )}
      
      {metaTags.ogType === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": metaTags.title,
            "description": metaTags.description,
            "image": metaTags.ogImage,
            "author": {
              "@type": "Person",
              "name": metaTags.articleAuthor
            },
            "publisher": {
              "@type": "Organization",
              "name": metaTags.ogSiteName,
              "logo": {
                "@type": "ImageObject",
                "url": metaTags.appleTouchIcon
              }
            },
            "datePublished": metaTags.articlePublishedTime,
            "dateModified": metaTags.articleModifiedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": metaTags.ogUrl
            }
          })}
        </script>
      )}
      
      {metaTags.ogType === 'website' && config.type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": metaTags.ogSiteName,
            "url": metaTags.ogUrl,
            "description": metaTags.description,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${metaTags.ogUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};