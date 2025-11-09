import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSettings } from '../context/SettingsContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        {/* Dynamic Site Title */}
        <title>{settings?.site?.name || 'Portfolio'}</title>
        
        {/* Meta Description */}
        <meta 
          name="description" 
          content={settings?.site?.description || settings?.personal?.bio || 'Professional portfolio website'} 
        />
        
        {/* Site URL */}
        {settings?.site?.url && <link rel="canonical" href={settings.site.url} />}
        
        {/* Favicon */}
        {settings?.site?.favicon && <link rel="icon" href={settings.site.favicon} />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={settings?.site?.name || 'Portfolio'} />
        <meta property="og:description" content={settings?.site?.description || 'Professional portfolio website'} />
        <meta property="og:type" content="website" />
        {settings?.site?.url && <meta property="og:url" content={settings.site.url} />}
        {settings?.site?.logo?.url && <meta property="og:image" content={settings.site.logo.url} />}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settings?.site?.name || 'Portfolio'} />
        <meta name="twitter:description" content={settings?.site?.description || 'Professional portfolio website'} />
        {settings?.site?.logo?.url && <meta name="twitter:image" content={settings.site.logo.url} />}
        {settings?.social?.twitter && (
          <meta name="twitter:creator" content={`@${settings.social.twitter.replace(/^@/, '').replace(/^https?:\/\/(www\.)?twitter\.com\//, '')}`} />
        )}
        
        {/* Author Information */}
        <meta name="author" content={settings?.personal?.name || 'Portfolio Owner'} />
        
        {/* Structured Data for Personal/Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": settings?.personal?.name,
            "jobTitle": settings?.personal?.title,
            "description": settings?.personal?.bio,
            "url": settings?.site?.url,
            "email": settings?.contact?.email?.primary,
            "telephone": settings?.contact?.phone?.primary,
            "address": settings?.contact?.address ? {
              "@type": "PostalAddress",
              "addressLocality": settings.contact.address.city,
              "addressRegion": settings.contact.address.state,
              "addressCountry": settings.contact.address.country,
              "postalCode": settings.contact.address.postalCode
            } : undefined,
            "sameAs": Object.values(settings?.social || {}).filter(url => url)
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};