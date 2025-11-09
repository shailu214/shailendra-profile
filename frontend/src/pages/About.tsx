import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { useProfile } from '../context/ProfileContext';
import { SEOHelmet } from '../components/SEOHelmet';
import { pageSEO } from '../utils/metaTags';

export const About: React.FC = () => {
  const { settings } = useSettings();
  const { publicProfile } = useProfile();

  return (
    <>
      <SEOHelmet config={pageSEO.about(publicProfile, settings)} />

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                About Me
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {publicProfile?.basicInfo?.bio || 
                 settings?.personal?.bio || 
                 'Passionate developer with a love for creating amazing digital experiences.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {(publicProfile?.basicInfo?.avatar?.url || settings?.personal?.avatar?.url) && (
                  <img
                    src={publicProfile?.basicInfo?.avatar?.url || settings?.personal?.avatar?.url}
                    alt={publicProfile?.basicInfo?.firstName || settings?.personal?.name || 'Profile'}
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                )}
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Hi, I'm {publicProfile?.basicInfo?.firstName || settings?.personal?.name || 'John Doe'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  I'm a passionate {publicProfile?.basicInfo?.title || settings?.personal?.title || 'developer'} with {publicProfile?.professional?.yearsOfExperience || '5+'} years of experience in building 
                  web applications using modern technologies. I love solving complex problems and 
                  creating user-friendly interfaces.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  When I'm not coding, you can find me exploring new technologies, contributing to 
                  open-source projects, or sharing my knowledge through blog posts and tutorials.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};