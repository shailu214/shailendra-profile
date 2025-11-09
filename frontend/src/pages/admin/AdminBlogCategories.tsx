import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { ToastContainer } from '../../components/admin/Toast';
import { useToast } from '../../hooks/useToast';
import { categoriesService } from '../../services/api';
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Palette,
  Eye,
  EyeOff,
  Hash,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  BarChart3,
  X,
  Save,
  RefreshCcw
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  isActive: boolean;
  postCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  categoriesWithPosts: number;
  emptyCategories: number;
  topCategories: Array<{ name: string; postCount: number }>;
}

export const AdminBlogCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingCounts, setIsUpdatingCounts] = useState(false);

  const { toasts, removeToast, success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    order: 0,
    isActive: true
  });

  // Predefined colors for categories
  const predefinedColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#DC2626', // Red-600
  ];

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesService.getAllAdmin();
      setCategories(response.data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      error('Load Error', 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await categoriesService.getStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: predefinedColors[0],
      order: categories.length,
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      order: category.order,
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      await categoriesService.delete(categoryToDelete._id);
      success('Category Deleted', `"${categoryToDelete.name}" has been successfully deleted.`);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      await fetchCategories();
      await fetchStats();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      error('Delete Failed', err.message || 'There was an error deleting the category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      error('Validation Error', 'Category name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        order: formData.order,
        isActive: formData.isActive
      };

      if (editingCategory) {
        await categoriesService.update(editingCategory._id, categoryData);
        success('Category Updated', `"${formData.name}" has been successfully updated.`);
      } else {
        await categoriesService.create(categoryData);
        success('Category Created', `"${formData.name}" has been successfully created.`);
      }
      
      setShowModal(false);
      setEditingCategory(null);
      await fetchCategories();
      await fetchStats();
    } catch (err: any) {
      console.error('Error saving category:', err);
      error('Save Failed', err.message || 'There was an error saving the category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await categoriesService.update(category._id, { isActive: !category.isActive });
      success(
        'Status Updated',
        `Category "${category.name}" has been ${!category.isActive ? 'activated' : 'deactivated'}.`
      );
      await fetchCategories();
      await fetchStats();
    } catch (err: any) {
      console.error('Error toggling category status:', err);
      error('Update Failed', 'Failed to update category status.');
    }
  };

  const handleUpdateCounts = async () => {
    setIsUpdatingCounts(true);
    try {
      await categoriesService.updateCounts();
      success('Counts Updated', 'All category post counts have been updated successfully.');
      await fetchCategories();
      await fetchStats();
    } catch (err: any) {
      console.error('Error updating counts:', err);
      error('Update Failed', 'Failed to update category post counts.');
    } finally {
      setIsUpdatingCounts(false);
    }
  };

  const handleMoveCategory = async (category: Category, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c._id === category._id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= categories.length) return;

    try {
      const updatedCategories = [...categories];
      const [moved] = updatedCategories.splice(currentIndex, 1);
      updatedCategories.splice(newIndex, 0, moved);

      // Update order values
      const categoryUpdates = updatedCategories.map((cat, index) => ({
        id: cat._id,
        order: index
      }));

      await categoriesService.updateOrder(categoryUpdates);
      await fetchCategories();
      success('Order Updated', 'Category order has been updated successfully.');
    } catch (err: any) {
      console.error('Error updating order:', err);
      error('Update Failed', 'Failed to update category order.');
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.isActive) ||
                         (statusFilter === 'inactive' && !category.isActive) ||
                         (statusFilter === 'with-posts' && category.postCount > 0) ||
                         (statusFilter === 'empty' && category.postCount === 0);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Categories</h1>
            <p className="mt-2 text-gray-600">
              Organize your blog posts with custom categories and manage their display order.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={handleUpdateCounts}
              disabled={isUpdatingCounts}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${isUpdatingCounts ? 'animate-spin' : ''}`} />
              Update Counts
            </button>
            <button 
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeCategories}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.categoriesWithPosts}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empty</p>
                <p className="text-3xl font-bold text-gray-900">{stats.emptyCategories}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Hash className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="with-posts">With Posts</option>
              <option value="empty">Empty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="w-6 h-6 animate-spin text-gray-400 mr-3" />
                      <span className="text-gray-500">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
                    <button
                      onClick={handleAddCategory}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Category
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                              {category.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Slug: {category.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          category.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {category.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Hash className="w-4 h-4 mr-1 text-gray-400" />
                        {category.postCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">{category.order}</span>
                        <div className="flex flex-col space-y-1 ml-2">
                          <button
                            onClick={() => handleMoveCategory(category, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveCategory(category, 'down')}
                            disabled={index === filteredCategories.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category)}
                          disabled={category.postCount > 0}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={category.postCount > 0 ? `Cannot delete: ${category.postCount} posts use this category` : 'Delete Category'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal/Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of this category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-6 h-6 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={
          categoryToDelete?.postCount && categoryToDelete.postCount > 0
            ? `Cannot delete "${categoryToDelete?.name}" because it is used by ${categoryToDelete.postCount} blog post(s). Please reassign those posts to another category first.`
            : `Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`
        }
        type="danger"
        confirmText={categoryToDelete?.postCount && categoryToDelete.postCount > 0 ? "OK" : "Delete Category"}
        cancelText="Cancel"
        loading={isDeleting}
        showCancel={!(categoryToDelete?.postCount && categoryToDelete.postCount > 0)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AdminLayout>
  );
};