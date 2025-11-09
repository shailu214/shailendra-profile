import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { profileService } from '../services/api';

interface Profile {
  _id?: string;
  basicInfo: {
    firstName: string;
    lastName: string;
    displayName?: string;
    title: string;
    bio: string;
    shortDescription: string;
    avatar?: {
      url: string;
      alt: string;
      size?: number;
    };
    coverImage?: {
      url: string;
      alt: string;
    };
  };
  professional: {
    yearsOfExperience: number;
    currentPosition: {
      title: string;
      company: string;
      startDate: string;
      isCurrent: boolean;
    };
    specializations: Array<{
      name: string;
      level: string;
      yearsOfExperience: number;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
      credentialId?: string;
      url?: string;
      isActive: boolean;
    }>;
    awards?: Array<{
      title: string;
      issuer: string;
      date: string;
      description: string;
      category: string;
    }>;
  };
  skills: {
    technical: Array<{
      name: string;
      category: string;
      proficiency: number;
      yearsOfExperience: number;
      isFeatured: boolean;
    }>;
    soft?: Array<{
      name: string;
      proficiency: number;
    }>;
    languages?: Array<{
      name: string;
      proficiency: string;
    }>;
  };
  experience?: Array<{
    _id?: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
    companyUrl?: string;
    companyLogo?: string;
  }>;
  education?: Array<{
    _id?: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
    description: string;
    achievements: string[];
  }>;
  personal: {
    dateOfBirth?: string;
    location: {
      city: string;
      state: string;
      country: string;
      timezone: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    availability: {
      status: 'Available' | 'Busy' | 'Not Available';
      message?: string;
      hourlyRate?: {
        min: number;
        max: number;
        currency: string;
      };
      workingHours?: {
        timezone: string;
        schedule: Array<{
          day: string;
          startTime: string;
          endTime: string;
          isAvailable: boolean;
        }>;
      };
    };
    interests?: string[];
    hobbies?: string[];
  };
  contactPreferences?: {
    preferredMethod: 'Email' | 'Phone' | 'LinkedIn' | 'WhatsApp';
    responseTime: string;
    timeZone: string;
    bestTimeToContact: string;
  };
  socialMedia: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
    portfolio?: string;
    blog?: string;
    custom?: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  stats: {
    projectsCompleted: number;
    clientsSatisfied: number;
    yearsOfExperience: number;
    technologiesMastered: number;
    customStats?: Array<{
      label: string;
      value: number;
      icon: string;
      color: string;
    }>;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    slug?: string;
  };
  privacy?: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showExperience: boolean;
    showEducation: boolean;
    profileVisibility: 'Public' | 'Private' | 'Limited';
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  publicProfile: Profile | null;
  loading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  loadPublicProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  updateSection: (section: keyof Profile, data: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [publicProfile, setPublicProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getMe();
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadPublicProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load public profile from API
      try {
        const response = await profileService.getPublic();
        if (response.data.success) {
          setPublicProfile(response.data.profile);
          return;
        }
      } catch (apiError) {
        console.warn('Public profile API failed, using fallback:', apiError);
      }
      
      // Fallback to default profile structure
      setPublicProfile({
        basicInfo: {
          firstName: 'John',
          lastName: 'Doe',
          title: 'Full Stack Developer',
          bio: 'Passionate developer creating amazing digital experiences.',
          shortDescription: 'Full Stack Developer & Designer'
        },
        professional: {
          yearsOfExperience: 5,
          currentPosition: {
            title: 'Senior Full Stack Developer',
            company: 'Tech Company',
            startDate: '2020-01-01',
            isCurrent: true
          },
          specializations: [
            { name: 'React.js', level: 'Expert', yearsOfExperience: 5 },
            { name: 'Node.js', level: 'Advanced', yearsOfExperience: 4 },
            { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 3 }
          ]
        },
        skills: {
          technical: [
            { name: 'React.js', category: 'Frontend', proficiency: 95, yearsOfExperience: 5, isFeatured: true },
            { name: 'Node.js', category: 'Backend', proficiency: 90, yearsOfExperience: 4, isFeatured: true },
            { name: 'TypeScript', category: 'Language', proficiency: 88, yearsOfExperience: 3, isFeatured: true },
            { name: 'MongoDB', category: 'Database', proficiency: 85, yearsOfExperience: 4, isFeatured: true }
          ]
        },
        personal: {
          location: {
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
            timezone: 'PST'
          },
          availability: {
            status: 'Available' as const,
            message: 'Open to new opportunities'
          }
        },
        socialMedia: {
          github: 'https://github.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          website: 'https://johndoe.dev'
        },
        stats: {
          projectsCompleted: 150,
          clientsSatisfied: 50,
          yearsOfExperience: 5,
          technologiesMastered: 25
        }
      });
    } catch (error: any) {
      console.error('Error loading public profile:', error);
      setError(error.message || 'Failed to load public profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      setError(null);
      const response = await profileService.update(profileData);
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const updateSection = async (section: keyof Profile, data: any) => {
    try {
      setError(null);
      const response = await profileService.updateSection(section as string, data);
      if (response.data.success) {
        setProfile(response.data.profile);
      }
    } catch (error: any) {
      console.error('Error updating profile section:', error);
      setError(error.message || 'Failed to update profile section');
      throw error;
    }
  };

  const refreshProfile = async () => {
    await Promise.all([loadProfile(), loadPublicProfile()]);
  };

  useEffect(() => {
    // Load public profile immediately for frontend use
    loadPublicProfile();
  }, []);

  const value: ProfileContextType = {
    profile,
    publicProfile,
    loading,
    error,
    loadProfile,
    loadPublicProfile,
    updateProfile,
    updateSection,
    refreshProfile
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};