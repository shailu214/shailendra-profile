import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { ToastContainer } from '../../components/admin/Toast';
import { YoastSEOAnalyzer } from '../../components/admin/YoastSEOAnalyzer';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { useToast } from '../../hooks/useToast';
import { portfolioService } from '../../services/api';
import { Plus, Edit, Trash2, Eye, ExternalLink, Search, Filter, Save, X, Grid3X3, List, Globe } from 'lucide-react';

interface Project {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  images: string[];
  image?: string; // Backward compatibility
  liveUrl?: string;
  githubUrl?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  status?: 'Published' | 'Draft' | 'In Progress'; // For UI display
  featured?: boolean; // Backward compatibility
  createdAt: string;
  views: number;
  likes: number;
  slug?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    keyphrase?: string;
    altText?: string;
  };
}



export const AdminPortfolio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Dynamic state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  
  const { toasts, removeToast, success, error } = useToast();

  // Filter projects based on search and filter criteria
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filter === 'all' || project.category === filter;
    
    return matchesSearch && matchesCategory;
  });
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: '',
    technologies: [],
    images: [],
    liveUrl: '',
    githubUrl: '',
    isPublished: false,
    isFeatured: false,
    seo: {
      title: '',
      description: '',
      keyphrase: '',
      altText: '',
      keywords: []
    }
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchPortfolioData();
    fetchMetadata();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getAllAdmin();
      console.log('Portfolio data:', response);
      
      // Transform API data to match component interface
      const transformedProjects = response.data?.map((project: any) => ({
        ...project,
        id: project.id || project._id,
        status: project.isPublished ? 'Published' : 'Draft',
        image: project.images?.[0] || '',
        featured: project.isFeatured,
        likes: project.likes || 0
      })) || [];

      setProjects(transformedProjects);
      
      // Calculate stats
      const totalProjects = transformedProjects.length;
      const publishedCount = transformedProjects.filter((p: any) => p.isPublished).length;
      const draftCount = totalProjects - publishedCount;
      const totalViews = transformedProjects.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
      
      setStats({
        total: totalProjects,
        published: publishedCount,
        draft: draftCount,
        totalViews
      });

    } catch (err: any) {
      console.error('Error fetching portfolio data:', err);
      error('Load Error', 'Failed to load portfolio data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [categoriesRes, technologiesRes] = await Promise.all([
        portfolioService.getCategories(),
        portfolioService.getTechnologies()
      ]);
      
      setCategories(categoriesRes.data || []);
      setTechnologies(technologiesRes.data || []);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  // CRUD Functions
  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      technologies: [],
      images: [],
      liveUrl: '',
      githubUrl: '',
      isPublished: false,
      isFeatured: false,
      seo: {
        title: '',
        description: '',
        keyphrase: '',
        altText: '',
        keywords: []
      }
    });
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      images: project.images || (project.image ? [project.image] : []),
      isPublished: project.isPublished !== undefined ? project.isPublished : project.status === 'Published',
      isFeatured: project.isFeatured !== undefined ? project.isFeatured : project.featured,
      seo: {
        title: project.seo?.title || '',
        description: project.seo?.description || '',
        keyphrase: project.seo?.keyphrase || '',
        altText: project.seo?.altText || '',
        keywords: project.seo?.keywords || []
      }
    });
    setShowModal(true);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      const projectId = projectToDelete._id || projectToDelete.id?.toString() || '';
      await portfolioService.delete(projectId);
      
      success('Project Deleted', `"${projectToDelete.title}" has been successfully deleted.`);
      setShowDeleteModal(false);
      setProjectToDelete(null);
      
      // Refresh the project list
      await fetchPortfolioData();
    } catch (err) {
      console.error('Error deleting project:', err);
      error('Delete Failed', 'There was an error deleting the project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies || [],
        images: formData.images || [],
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        isPublished: formData.isPublished || false,
        isFeatured: formData.isFeatured || false,
        seo: formData.seo || {}
      };

      if (editingProject) {
        // Update existing project
        await portfolioService.update(editingProject._id || editingProject.id?.toString() || '', projectData);
        success('Project Updated', `"${formData.title}" has been successfully updated.`);
      } else {
        // Add new project
        await portfolioService.create(projectData);
        success('Project Created', `"${formData.title}" has been successfully created.`);
      }
      
      // Refresh the project list
      await fetchPortfolioData();
      setShowModal(false);
      setEditingProject(null);
    } catch (err: any) {
      console.error('Error saving project:', err);
      error('Save Failed', 'There was an error saving the project. Please try again.');
    }
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechnologyChange = (techString: string) => {
    const technologies = techString.split(',').map(tech => tech.trim()).filter(tech => tech);
    setFormData(prev => ({ ...prev, technologies }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
            <p className="mt-2 text-gray-600">
              Manage your portfolio projects and showcase your work.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4 mr-2" /> : <Grid3X3 className="w-4 h-4 mr-2" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <button 
              onClick={handleAddProject}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton for stats
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.published}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.draft}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Edit className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
            {(searchTerm || filter !== 'all') && (
              <span className="ml-2">
                {searchTerm && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-1">"{searchTerm}"</span>}
                {filter !== 'all' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs ml-1">{filter}</span>}
              </span>
            )}
          </span>
          
          {(searchTerm || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-300"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="flex space-x-1">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 && projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-500 mb-6">Start building your portfolio by adding your first project.</p>
          <button
            onClick={handleAddProject}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        filteredProjects.length === 0 && projects.length > 0 ? (
          <div className="text-center py-12 col-span-full">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500 mb-4">
              No projects match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status || 'Draft')}`}>
                  {project.status || (project.isPublished ? 'Published' : 'Draft')}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                <span>{project.views.toLocaleString()} views</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview Project"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {project.liveUrl && (
                  <button 
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Live
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
          </div>
        )
      )}

      {/* Project Modal/Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description * (Rich Text with H2/H3 Support)
                </label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Enter project description with headings and formatting..."
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <input
                  type="text"
                  value={formData.technologies?.join(', ') || ''}
                  onChange={(e) => handleTechnologyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB (comma separated)"
                />
                <p className="text-sm text-gray-500 mt-1">Separate technologies with commas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl || ''}
                    onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Images (URLs)
                </label>
                <input
                  type="text"
                  value={formData.images?.join(', ') || ''}
                  onChange={(e) => {
                    const images = e.target.value.split(',').map(img => img.trim()).filter(img => img);
                    handleInputChange('images', images);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://image1.jpg, https://image2.jpg (comma separated)"
                />
                <p className="text-sm text-gray-500 mt-1">Add multiple image URLs separated by commas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished || false}
                      onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Published (visible to public)
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Featured Project
                    </span>
                  </label>
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  SEO Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.title || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo!, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Custom SEO title (leave blank to use project title)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Length: {(formData.seo?.title || '').length}/60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seo?.description || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo!, description: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Custom SEO description (leave blank to use project description)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Length: {(formData.seo?.description || '').length}/160 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Keyphrase
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.keyphrase || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo!, keyphrase: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Main keyword for this project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.seo?.altText || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          seo: { ...prev.seo!, altText: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descriptive alt text for project image"
                      />
                    </div>
                  </div>

                  {/* SEO Analysis */}
                  {(formData.title || formData.seo?.title) && (
                    <div className="mt-4">
                      <YoastSEOAnalyzer
                        title={formData.seo?.title || formData.title || ''}
                        description={formData.seo?.description || formData.description || ''}
                        keyphrase={formData.seo?.keyphrase || ''}
                        content={formData.description || ''}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete Project"
        cancelText="Cancel"
        loading={isDeleting}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AdminLayout>
  );
};