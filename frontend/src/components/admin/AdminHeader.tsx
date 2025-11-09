import React, { useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Settings, LogOut, Menu, User, ChevronRight, Home } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{ name: string; path: string; icon?: any }> = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: Home }
    ];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[1];
      const pageNames: { [key: string]: string } = {
        'dashboard': 'Dashboard',
        'profile': 'Profile',
        'portfolio': 'Portfolio',
        'blog': 'Blog Posts',
        'pages': 'Pages',
        'testimonials': 'Testimonials',
        'gallery': 'Gallery',
        'messages': 'Messages',
        'users': 'Users',
        'analytics': 'Analytics',
        'settings': 'Settings'
      };

      breadcrumbs.push({
        name: pageNames[currentPage] || currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
        path: `/admin/${currentPage}`
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: 'New Contact Message',
      message: 'You have received a new contact form submission',
      time: '2 minutes ago',
      type: 'message',
      read: false
    },
    {
      id: 2,
      title: 'Blog Post Published',
      message: 'Your blog post "React Best Practices" is now live',
      time: '1 hour ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'SEO Alert',
      message: 'Homepage SEO score has improved to 95%',
      time: '2 hours ago',
      type: 'info',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="hidden lg:block">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.path} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                  <Link
                    to={breadcrumb.path}
                    className={`flex items-center space-x-1 hover:text-gray-900 transition-colors ${
                      location.pathname === breadcrumb.path ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4" />}
                    <span>{breadcrumb.name}</span>
                  </Link>
                </div>
              ))}
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">
              {breadcrumbs[breadcrumbs.length - 1].name}
            </h1>
            <p className="text-sm text-gray-600">
              {breadcrumbs[breadcrumbs.length - 1].name === 'Dashboard' 
                ? 'Welcome back, manage your portfolio'
                : breadcrumbs[breadcrumbs.length - 1].name === 'Pages'
                ? 'Manage website pages with SEO optimization'
                : `Manage your ${breadcrumbs[breadcrumbs.length - 1].name.toLowerCase()}`
              }
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <span className="text-sm text-gray-500">{unreadCount} unread</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'message' ? 'bg-blue-500' :
                            notification.type === 'success' ? 'bg-green-500' :
                            'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link 
            to="/admin/settings"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Shailendra Chaurasia</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="lg:hidden mt-4">
        <nav className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />}
              <Link
                to={breadcrumb.path}
                className={`hover:text-gray-900 transition-colors ${
                  location.pathname === breadcrumb.path ? 'text-blue-600 font-medium' : ''
                }`}
              >
                {breadcrumb.name}
              </Link>
            </div>
          ))}
        </nav>
        <h1 className="text-xl font-bold text-gray-900">
          {breadcrumbs[breadcrumbs.length - 1].name}
        </h1>
        <p className="text-sm text-gray-600">Portfolio Management</p>
      </div>
    </header>
  );
};