import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  Plus, 
  Upload,
  Trash2, 
  Edit,
  Search, 
  Filter,
  Grid,
  List,
  Download,
  Eye,
  Image as ImageIcon,
  Video,
  FileText,
  Folder,
  Calendar,
  User,
  MoreHorizontal,
  Copy,
  Share,
  Star
} from 'lucide-react';

interface MediaFile {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  dimensions?: string;
  url: string;
  thumbnail: string;
  uploadDate: string;
  uploadedBy: string;
  tags: string[];
  folder: string;
  isStarred: boolean;
  downloads: number;
  description?: string;
}

export const AdminGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const mediaFiles: MediaFile[] = [
    {
      id: 1,
      name: 'hero-background.jpg',
      type: 'image',
      size: '2.4 MB',
      dimensions: '1920x1080',
      url: 'https://via.placeholder.com/1920x1080?text=Hero+Background',
      thumbnail: 'https://via.placeholder.com/300x200?text=Hero+Background',
      uploadDate: '2024-03-15',
      uploadedBy: 'Shailendra Chaurasia',
      tags: ['hero', 'background', 'homepage'],
      folder: 'Images/Backgrounds',
      isStarred: true,
      downloads: 45,
      description: 'Main hero section background image for homepage'
    },
    {
      id: 2,
      name: 'portfolio-project-1.png',
      type: 'image',
      size: '1.8 MB',
      dimensions: '1200x800',
      url: 'https://via.placeholder.com/1200x800?text=Portfolio+Project+1',
      thumbnail: 'https://via.placeholder.com/300x200?text=Portfolio+Project+1',
      uploadDate: '2024-03-14',
      uploadedBy: 'Shailendra Chaurasia',
      tags: ['portfolio', 'project', 'ecommerce'],
      folder: 'Images/Portfolio',
      isStarred: false,
      downloads: 23,
      description: 'E-commerce platform project screenshot'
    },
    {
      id: 3,
      name: 'demo-video.mp4',
      type: 'video',
      size: '15.6 MB',
      dimensions: '1280x720',
      url: 'https://via.placeholder.com/1280x720?text=Demo+Video',
      thumbnail: 'https://via.placeholder.com/300x200?text=Demo+Video',
      uploadDate: '2024-03-13',
      uploadedBy: 'Shailendra Chaurasia',
      tags: ['demo', 'tutorial', 'react'],
      folder: 'Videos/Tutorials',
      isStarred: true,
      downloads: 67,
      description: 'React application demo video'
    },
    {
      id: 4,
      name: 'client-logo-techcorp.svg',
      type: 'image',
      size: '45 KB',
      dimensions: '400x150',
      url: 'https://via.placeholder.com/400x150?text=TechCorp+Logo',
      thumbnail: 'https://via.placeholder.com/300x200?text=TechCorp+Logo',
      uploadDate: '2024-03-12',
      uploadedBy: 'Shailendra Chaurasia',
      tags: ['logo', 'client', 'techcorp'],
      folder: 'Images/Logos',
      isStarred: false,
      downloads: 12,
      description: 'TechCorp client logo'
    },
    {
      id: 5,
      name: 'resume-2024.pdf',
      type: 'document',
      size: '892 KB',
      url: '/documents/resume-2024.pdf',
      thumbnail: 'https://via.placeholder.com/300x200?text=PDF+Document',
      uploadDate: '2024-03-10',
      uploadedBy: 'Shailendra Chaurasia',
      tags: ['resume', 'cv', 'document'],
      folder: 'Documents/Personal',
      isStarred: true,
      downloads: 89,
      description: 'Updated resume for 2024'
    },
    {
      id: 6,
      name: 'blog-featured-image.jpg',
      type: 'image',
      size: '1.2 MB',
      dimensions: '800x600',
      url: 'https://via.placeholder.com/800x600?text=Blog+Featured',
      thumbnail: 'https://via.placeholder.com/300x200?text=Blog+Featured',
      uploadDate: '2024-03-08',
      uploadedBy: 'Shailendra Chaurasia',
      tags: ['blog', 'featured', 'react19'],
      folder: 'Images/Blog',
      isStarred: false,
      downloads: 34,
      description: 'Featured image for React 19 blog post'
    }
  ];

  const folders = ['Images/Backgrounds', 'Images/Portfolio', 'Images/Logos', 'Images/Blog', 'Videos/Tutorials', 'Documents/Personal'];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'document':
        return FileText;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'text-green-600 bg-green-100';
      case 'video':
        return 'text-blue-600 bg-blue-100';
      case 'document':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    const matchesFolder = folderFilter === 'all' || file.folder === folderFilter;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleStarred = (fileId: number) => {
    console.log('Toggling starred for file:', fileId);
    // Implementation would go here
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
            <p className="mt-2 text-gray-600">
              Manage your images, videos, and documents in one place.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Folder className="w-4 h-4 mr-2" />
              New Folder
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-3xl font-bold text-gray-900">{mediaFiles.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-3xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.type === 'image').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-3xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.type === 'video').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-3xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.type === 'document').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage</p>
              <p className="text-2xl font-bold text-gray-900">124 MB</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Folder className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>
            </div>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Folders</option>
                {folders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              {selectedFiles.length} file(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
              <button className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type);
            const isSelected = selectedFiles.includes(file.id);
            
            return (
              <div
                key={file.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
                  isSelected ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <div className="relative">
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getFileTypeColor(file.type)}`}>
                      <FileIcon className="w-3 h-3 mr-1" />
                      {file.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => toggleStarred(file.id)}
                      className={`p-1.5 rounded-full ${file.isStarred ? 'bg-yellow-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-yellow-500 hover:text-white'} transition-colors`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFileSelection(file.id)}
                      className={`p-1.5 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white'} transition-colors`}
                    >
                      ✓
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {file.size} • {file.dimensions}
                  </p>
                  
                  {file.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {file.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {file.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {file.uploadedBy}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const isSelected = selectedFiles.includes(file.id);
                
                return (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFileSelection(file.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={file.thumbnail}
                          alt={file.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {file.name}
                          </h3>
                          <p className="text-sm text-gray-500">{file.folder}</p>
                        </div>
                        {file.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getFileTypeColor(file.type)}`}>
                        <FileIcon className="w-3 h-3 mr-1" />
                        {file.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{file.uploadedBy}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {file.downloads}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </AdminLayout>
  );
};