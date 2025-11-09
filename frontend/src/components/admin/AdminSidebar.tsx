import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  User,
  FileText,
  MessageSquare,
  Star,
  Settings,
  Image,
  BarChart3,
  Users,
  Globe,
  X,
  Files
} from 'lucide-react';
import '../../styles/admin-sidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin/dashboard',
      description: 'Overview & Analytics'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/admin/profile',
      description: 'Personal Information'
    },
    { 
      id: 'portfolio', 
      label: 'Portfolio', 
      icon: FileText, 
      path: '/admin/portfolio',
      description: 'Manage Projects'
    },
    { 
      id: 'blog', 
      label: 'Blog Posts', 
      icon: FileText, 
      path: '/admin/blog',
      description: 'Articles & Content'
    },
    { 
      id: 'pages', 
      label: 'Pages', 
      icon: Files, 
      path: '/admin/pages',
      description: 'Page Management & SEO'
    },
    { 
      id: 'testimonials', 
      label: 'Testimonials', 
      icon: Star, 
      path: '/admin/testimonials',
      description: 'Client Reviews'
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      icon: Image, 
      path: '/admin/gallery',
      description: 'Media Management'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      path: '/admin/messages',
      description: 'Contact Inquiries'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      path: '/admin/users',
      description: 'User Management'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/admin/analytics',
      description: 'Site Statistics'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/admin/settings',
      description: 'Site Configuration'
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-72 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">Portfolio Manager</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar-nav flex-1 px-4 py-4 overflow-y-auto min-h-0">
          <div className="space-y-1 pb-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActiveRoute(item.path) 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  isActiveRoute(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    isActiveRoute(item.path) ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActiveRoute(item.path) && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-700">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">SC</span>
              </div>
              <div>
                <p className="font-medium text-sm">Shailendra Chaurasia</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                to="/admin/profile"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Profile
              </Link>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};