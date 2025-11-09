import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Settings as SettingsIcon,
  Camera,
  Save,
  Plus,
  X,
  Edit3,
  MapPin,
  Calendar,
  Globe,
  Phone,
  Mail,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';
import { profileService } from '../../services/api';

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
  };
  skills: {
    technical: Array<{
      name: string;
      category: string;
      proficiency: number;
      yearsOfExperience: number;
      isFeatured: boolean;
    }>;
  };
  personal: {
    location: {
      city: string;
      state: string;
      country: string;
      timezone: string;
    };
    availability: {
      status: string;
      message: string;
    };
  };
  socialMedia: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  stats: {
    projectsCompleted: number;
    clientsSatisfied: number;
    yearsOfExperience: number;
    technologiesMastered: number;
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
}

export const AdminProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState<Profile>({
    basicInfo: {
      firstName: '',
      lastName: '',
      title: '',
      bio: '',
      shortDescription: ''
    },
    professional: {
      yearsOfExperience: 0,
      currentPosition: {
        title: '',
        company: '',
        startDate: '',
        isCurrent: true
      },
      specializations: []
    },
    skills: {
      technical: []
    },
    personal: {
      location: {
        city: '',
        state: '',
        country: '',
        timezone: ''
      },
      availability: {
        status: 'Available',
        message: ''
      }
    },
    socialMedia: {},
    stats: {
      projectsCompleted: 0,
      clientsSatisfied: 0,
      yearsOfExperience: 0,
      technologiesMastered: 0
    },
    experience: [],
    education: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Calendar },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'personal', label: 'Personal', icon: MapPin },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: SettingsIcon }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMe();
      if (response.data.success) {
        setProfile(response.data.profile);
        if (response.data.profile.basicInfo.avatar?.url) {
          setAvatarPreview(response.data.profile.basicInfo.avatar.url);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await profileService.update(profile);
      if (response.data.success) {
        // Show success message
        console.log('Profile saved successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server
        const response = await profileService.uploadAvatar(file);
        if (response.data.success) {
          setProfile(prev => ({
            ...prev,
            basicInfo: {
              ...prev.basicInfo,
              avatar: {
                url: response.data.avatarUrl,
                alt: `${profile.basicInfo.firstName} ${profile.basicInfo.lastName} profile picture`,
                size: file.size
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  // Skills Management
  const addSkill = () => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: [
          ...prev.skills.technical,
          {
            name: '',
            category: '',
            proficiency: 50,
            yearsOfExperience: 1,
            isFeatured: false
          }
        ]
      }
    }));
  };

  const updateSkill = (index: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: prev.skills.technical.map((skill, i) => 
          i === index ? { ...skill, [field]: value } : skill
        )
      }
    }));
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: prev.skills.technical.filter((_, i) => i !== index)
      }
    }));
  };

  // Specializations Management
  const addSpecialization = () => {
    setProfile(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        specializations: [
          ...prev.professional.specializations,
          {
            name: '',
            level: 'Intermediate',
            yearsOfExperience: 1
          }
        ]
      }
    }));
  };

  const updateSpecialization = (index: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        specializations: prev.professional.specializations.map((spec, i) => 
          i === index ? { ...spec, [field]: value } : spec
        )
      }
    }));
  };

  const removeSpecialization = (index: number) => {
    setProfile(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        specializations: prev.professional.specializations.filter((_, i) => i !== index)
      }
    }));
  };

  // Experience Management
  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      responsibilities: [''],
      achievements: [''],
      technologies: [''],
      companyUrl: '',
      companyLogo: ''
    };
    
    setProfile(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience]
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).map((exp: any, i: number) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_: any, i: number) => i !== index)
    }));
  };

  // Education Management
  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: 0,
      description: '',
      achievements: ['']
    };
    
    setProfile(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      education: (prev.education || []).map((edu: any, i: number) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: (prev.education || []).filter((_: any, i: number) => i !== index)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Profile Management - Admin</title>
      </Helmet>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
            <p className="mt-2 text-gray-600">
              Manage your professional profile information and settings
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Shailendra Chaurasia</h3>
                <p className="text-sm text-gray-500">Administrator</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Shailendra"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Chaurasia"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      defaultValue="admin@portfolio.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      defaultValue="Mumbai, India"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Senior Full Stack Developer with 8+ years of experience in React, Node.js, and modern web technologies. Passionate about creating scalable and user-friendly applications."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profile Photo</h3>
                    <p className="text-sm text-gray-600">Upload a professional photo</p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.basicInfo.firstName}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, firstName: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.basicInfo.lastName}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        basicInfo: { ...prev.basicInfo, lastName: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={profile.basicInfo.title}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, title: e.target.value }
                    }))}
                    placeholder="e.g., Senior Full Stack Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={profile.basicInfo.shortDescription}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, shortDescription: e.target.value }
                    }))}
                    placeholder="Brief tagline for your profile"
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.basicInfo.shortDescription?.length || 0}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={profile.basicInfo.bio}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      basicInfo: { ...prev.basicInfo, bio: e.target.value }
                    }))}
                    placeholder="Tell your professional story..."
                    rows={6}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.basicInfo.bio?.length || 0}/1000 characters
                  </p>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio Statistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Projects Completed
                    </label>
                    <input
                      type="number"
                      value={profile.stats.projectsCompleted}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        stats: { ...prev.stats, projectsCompleted: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clients Satisfied
                    </label>
                    <input
                      type="number"
                      value={profile.stats.clientsSatisfied}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        stats: { ...prev.stats, clientsSatisfied: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Social Media Links</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      value={profile.socialMedia.github || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, github: e.target.value }
                      }))}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={profile.socialMedia.linkedin || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Profile
                    </label>
                    <input
                      type="url"
                      value={profile.socialMedia.twitter || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                      }))}
                      placeholder="https://twitter.com/yourusername"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Technical Skills</h2>
                  <button
                    onClick={addSkill}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-4">
                  {profile.skills.technical.map((skill, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Skill #{index + 1}</h3>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., React"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={skill.category}
                            onChange={(e) => updateSkill(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Category</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Design">Design</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proficiency: {skill.proficiency}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.proficiency}
                            onChange={(e) => updateSkill(index, 'proficiency', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Experience
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={skill.yearsOfExperience}
                            onChange={(e) => updateSkill(index, 'yearsOfExperience', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={skill.isFeatured}
                            onChange={(e) => updateSkill(index, 'isFeatured', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">Featured skill (show on homepage)</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  
                  {profile.skills.technical.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No skills added yet. Click "Add Skill" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                  <button
                    onClick={addExperience}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </button>
                </div>

                <div className="space-y-6">
                  {(profile.experience || []).map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Experience #{index + 1}</h3>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Company Name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Position Title
                          </label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Job Title"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(index, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="City, State/Country"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Website
                          </label>
                          <input
                            type="url"
                            value={exp.companyUrl || ''}
                            onChange={(e) => updateExperience(index, 'companyUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://company.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={exp.endDate || ''}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            disabled={exp.isCurrent}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                          <label className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={exp.isCurrent}
                              onChange={(e) => {
                                updateExperience(index, 'isCurrent', e.target.checked);
                                if (e.target.checked) {
                                  updateExperience(index, 'endDate', '');
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">Currently working here</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your role and responsibilities..."
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(profile.experience || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No work experience added yet. Click "Add Experience" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                  <button
                    onClick={addEducation}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </button>
                </div>

                <div className="space-y-6">
                  {(profile.education || []).map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Education #{index + 1}</h3>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institution Name
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="University/College Name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Degree
                          </label>
                          <select
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Degree</option>
                            <option value="High School Diploma">High School Diploma</option>
                            <option value="Associate's Degree">Associate's Degree</option>
                            <option value="Bachelor's Degree">Bachelor's Degree</option>
                            <option value="Master's Degree">Master's Degree</option>
                            <option value="Doctoral Degree">Doctoral Degree</option>
                            <option value="Certificate">Certificate</option>
                            <option value="Bootcamp">Bootcamp</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GPA (Optional)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="4"
                            step="0.01"
                            value={edu.gpa || ''}
                            onChange={(e) => updateEducation(index, 'gpa', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="4.0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={edu.endDate || ''}
                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your studies, relevant coursework, projects..."
                        />
                      </div>
                    </div>
                  ))}
                  
                  {(profile.education || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No education records added yet. Click "Add Education" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h2>
                
                {/* Current Position */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Current Position</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={profile.professional.currentPosition.title}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          professional: {
                            ...prev.professional,
                            currentPosition: {
                              ...prev.professional.currentPosition,
                              title: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Senior Full-Stack Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profile.professional.currentPosition.company}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          professional: {
                            ...prev.professional,
                            currentPosition: {
                              ...prev.professional.currentPosition,
                              company: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Current Company"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={profile.professional.currentPosition.startDate}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          professional: {
                            ...prev.professional,
                            currentPosition: {
                              ...prev.professional.currentPosition,
                              startDate: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={profile.professional.yearsOfExperience}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          professional: {
                            ...prev.professional,
                            yearsOfExperience: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.professional.currentPosition.isCurrent}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          professional: {
                            ...prev.professional,
                            currentPosition: {
                              ...prev.professional.currentPosition,
                              isCurrent: e.target.checked
                            }
                          }
                        }))}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Currently employed here</span>
                    </label>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Specializations</h3>
                    <button
                      onClick={addSpecialization}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Specialization
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {profile.professional.specializations.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => updateSpecialization(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., React Development"
                        />
                        
                        <select
                          value={spec.level}
                          onChange={(e) => updateSpecialization(index, 'level', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={spec.yearsOfExperience}
                          onChange={(e) => updateSpecialization(index, 'yearsOfExperience', parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Years"
                        />
                        
                        <button
                          onClick={() => removeSpecialization(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {profile.professional.specializations.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No specializations added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                {/* Location */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profile.personal.location.city}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            location: {
                              ...prev.personal.location,
                              city: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={profile.personal.location.state}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            location: {
                              ...prev.personal.location,
                              state: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="NY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profile.personal.location.country}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            location: {
                              ...prev.personal.location,
                              country: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="United States"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={profile.personal.location.timezone}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            location: {
                              ...prev.personal.location,
                              timezone: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Timezone</option>
                        <option value="UTC-12:00">(UTC-12:00) International Date Line West</option>
                        <option value="UTC-11:00">(UTC-11:00) Coordinated Universal Time-11</option>
                        <option value="UTC-10:00">(UTC-10:00) Hawaii</option>
                        <option value="UTC-09:00">(UTC-09:00) Alaska</option>
                        <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                        <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
                        <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
                        <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</option>
                        <option value="UTC+00:00">(UTC+00:00) Greenwich Mean Time</option>
                        <option value="UTC+01:00">(UTC+01:00) Central European Time</option>
                        <option value="UTC+05:30">(UTC+05:30) India Standard Time</option>
                        <option value="UTC+08:00">(UTC+08:00) China Standard Time</option>
                        <option value="UTC+09:00">(UTC+09:00) Japan Standard Time</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Availability */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Availability Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Status
                      </label>
                      <select
                        value={profile.personal.availability.status}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            availability: {
                              ...prev.personal.availability,
                              status: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Available">Available for work</option>
                        <option value="Open to opportunities">Open to opportunities</option>
                        <option value="Busy">Currently busy</option>
                        <option value="Not available">Not available</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability Message
                      </label>
                      <textarea
                        value={profile.personal.availability.message}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            availability: {
                              ...prev.personal.availability,
                              message: e.target.value
                            }
                          }
                        }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a custom message about your availability..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};