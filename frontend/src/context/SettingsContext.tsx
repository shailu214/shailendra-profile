import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { settingsService } from '../services/api';

interface Settings {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo?: { url: string; alt: string };
    favicon?: string;
    url: string;
  };
  personal: {
    name: string;
    title: string;
    bio?: string;
    avatar?: { url: string; alt: string };
    location?: {
      city: string;
      country: string;
      timezone: string;
    };
    availability: {
      status: 'Available' | 'Busy' | 'Not Available';
      message?: string;
    };
  };
  contact: {
    email: {
      primary: string;
      business?: string;
    };
    phone?: {
      primary: string;
      whatsapp?: string;
    };
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  theme: {
    colorScheme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    animations: boolean;
  };
  navigation: {
    showLogo: boolean;
    menuItems: Array<{
      label: string;
      path: string;
      isExternal: boolean;
      isActive: boolean;
      order: number;
    }>;
    showSocial: boolean;
    stickyHeader: boolean;
  };
  homepage: {
    heroSection: {
      showAnimation: boolean;
      backgroundType: 'gradient' | 'image' | 'video' | 'particles';
      backgroundImage?: string;
      backgroundVideo?: string;
      ctaButton: {
        text: string;
        link: string;
        isExternal: boolean;
      };
    };
    sections: {
      showAbout: boolean;
      showSkills: boolean;
      showPortfolio: boolean;
      showBlog: boolean;
      showContact: boolean;
    };
  };
  analytics: {
    googleAnalytics: {
      trackingId?: string;
      enabled: boolean;
    };
    googleTagManager: {
      containerId?: string;
      enabled: boolean;
    };
    facebookPixel: {
      pixelId?: string;
      enabled: boolean;
    };
  };
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to show content immediately
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load settings from API
      try {
        const data = await settingsService.getPublicSettings();
        setSettings((data as any)?.settings || data);
        setLoading(false);
        return;
      } catch (apiError) {
        console.warn('Settings API failed, using fallback:', apiError);
      }
      
      // Fallback to default settings if API fails
      setSettings({
        site: {
          name: 'Portfolio',
          tagline: 'Full Stack Developer',
          description: 'Welcome to my portfolio website',
          url: window.location.origin,
        },
        personal: {
          name: 'John Doe',
          title: 'Full Stack Developer',
          bio: 'Passionate developer creating amazing digital experiences.',
          availability: {
            status: 'Available',
          },
        },
        contact: {
          email: {
            primary: 'contact@example.com',
          },
        },
        social: {},
        theme: {
          colorScheme: 'auto',
          primaryColor: '#3B82F6',
          secondaryColor: '#EF4444',
          fontFamily: 'Inter',
          animations: true,
        },
        navigation: {
          showLogo: true,
          menuItems: [],
          showSocial: true,
          stickyHeader: true,
        },
        homepage: {
          heroSection: {
            showAnimation: true,
            backgroundType: 'gradient',
            ctaButton: {
              text: 'View My Work',
              link: '/portfolio',
              isExternal: false,
            },
          },
          sections: {
            showAbout: true,
            showSkills: true,
            showPortfolio: true,
            showBlog: true,
            showContact: true,
          },
        },
        analytics: {
          googleAnalytics: {
            enabled: false,
          },
          googleTagManager: {
            enabled: false,
          },
          facebookPixel: {
            enabled: false,
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  useEffect(() => {
    // Load settings immediately with fallback
    loadSettings();
  }, []);

  // Provide default settings immediately if none are loaded
  useEffect(() => {
    if (!settings && !loading) {
      setSettings({
        site: {
          name: 'Shailendra Chaurasia Portfolio',
          tagline: 'Senior Full Stack Developer',
          description: 'Welcome to my portfolio website',
          url: window.location.origin,
        },
        personal: {
          name: 'Shailendra Chaurasia',
          title: 'Senior Full Stack Developer',
          bio: 'Passionate developer creating amazing digital experiences.',
          availability: {
            status: 'Available',
          },
        },
        contact: {
          email: {
            primary: 'shailendra.chaurasia@gmail.com',
          },
        },
        social: {},
        theme: {
          colorScheme: 'auto',
          primaryColor: '#3B82F6',
          secondaryColor: '#EF4444',
          fontFamily: 'Inter',
          animations: true,
        },
        navigation: {
          showLogo: true,
          menuItems: [],
          showSocial: true,
          stickyHeader: true,
        },
        homepage: {
          heroSection: {
            showAnimation: true,
            backgroundType: 'gradient',
            ctaButton: {
              text: 'View My Work',
              link: '/portfolio',
              isExternal: false,
            },
          },
          sections: {
            showAbout: true,
            showSkills: true,
            showPortfolio: true,
            showBlog: true,
            showContact: true,
          },
        },
        analytics: {
          googleAnalytics: {
            enabled: false,
          },
          googleTagManager: {
            enabled: false,
          },
          facebookPixel: {
            enabled: false,
          },
        },
      });
    }
  }, [settings, loading]);

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    refreshSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};