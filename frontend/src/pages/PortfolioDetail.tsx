import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHelmet } from '../components/SEOHelmet';
import { generatePortfolioSEO } from '../utils/metaTags';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Eye, 
  Heart, 
  Tag,
  Share2,
  ChevronLeft,
  ChevronRight,
  Code,
  Star,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { portfolioService } from '../services/api';

interface Portfolio {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  images: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  createdAt: string;
  views?: number;
  likes?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  content?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  results?: string[];
}

export const PortfolioDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [project, setProject] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Portfolio[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getBySlug(slug!);
      setProject(response.data);
      
      // Fetch related projects
      if (response.data.category) {
        const relatedResponse = await portfolioService.getAll({
          category: response.data.category,
          limit: 3,
          exclude: response.data._id || response.data.id
        });
        setRelatedProjects(relatedResponse.data.projects || []);
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      setError(error.response?.data?.message || 'Failed to load project');
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!project) return;
    try {
      await portfolioService.like(project.slug || project._id!);
      setIsLiked(!isLiked);
      setProject(prev => prev ? { 
        ...prev, 
        likes: (prev.likes || 0) + (isLiked ? -1 : 1) 
      } : null);
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  const shareProject = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: project?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-32"></div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Project Not Found'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/portfolio"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet config={generatePortfolioSEO(project, settings)} />

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Navigation */}
            <Link
              to="/portfolio"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>

            {/* Project Header */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                    {project.category}
                  </span>
                  {project.isFeatured && (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-sm font-medium rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  {project.views && (
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      <span>{project.views} views</span>
                    </div>
                  )}
                  {project.likes && (
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      <span>{project.likes} likes</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      View Live Project
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Source
                    </a>
                  )}
                  <button
                    onClick={handleLike}
                    className={`inline-flex items-center px-6 py-3 border-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    onClick={shareProject}
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Images */}
              <div className="relative">
                {project.images && project.images.length > 0 ? (
                  <div className="relative">
                    <img
                      src={project.images[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full aspect-video object-cover rounded-2xl shadow-lg"
                    />
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {project.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Code className="w-16 h-16 text-white/70" />
                  </div>
                )}

                {/* Image Thumbnails */}
                {project.images && project.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {project.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex 
                            ? 'border-blue-500' 
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Details */}
            {project.content && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Project Details</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                </div>
              </div>
            )}

            {/* Features, Challenges, Solutions Grid */}
            {(project.features || project.challenges || project.solutions || project.results) && (
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {project.features && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-6 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-green-700 dark:text-green-300">
                          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.challenges && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-6">
                      Challenges Faced
                    </h3>
                    <ul className="space-y-3">
                      {project.challenges.map((challenge, index) => (
                        <li key={index} className="text-orange-700 dark:text-orange-300">
                          • {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.solutions && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-6">
                      Solutions Implemented
                    </h3>
                    <ul className="space-y-3">
                      {project.solutions.map((solution, index) => (
                        <li key={index} className="text-blue-700 dark:text-blue-300">
                          • {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.results && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-6">
                      Results & Impact
                    </h3>
                    <ul className="space-y-3">
                      {project.results.map((result, index) => (
                        <li key={index} className="text-purple-700 dark:text-purple-300">
                          • {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-16">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Related Projects
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((relatedProject, index) => (
                    <motion.div
                      key={relatedProject._id || relatedProject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/portfolio/${relatedProject.slug || relatedProject._id}`} className="block">
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                            {relatedProject.images?.[0] ? (
                              <img
                                src={relatedProject.images[0]}
                                alt={relatedProject.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Code className="w-8 h-8 text-white/70" />
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 block">
                              {relatedProject.category}
                            </span>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {relatedProject.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {relatedProject.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};