import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Edit,
  Plus,
  Eye,
  BarChart3,
  Star,
  Activity,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/api';

// Type definitions
interface DashboardStat {
  id?: number;
  title: string;
  label?: string;
  value: string;
  icon: React.ComponentType<any>;
  change: string;
  changeType: 'positive' | 'neutral' | 'negative';
  color: string;
}

// Icon mapping
const iconMap = {
  'FolderIcon': FileText,
  'DocumentTextIcon': Edit,
  'ChatBubbleLeftIcon': MessageSquare,
  'EyeIcon': Eye,
};

// Type for activities
interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  user: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Analytics interface
interface AnalyticsData {
  performanceScore: number;
  totalBlogs: number;
  totalViews: number;
  avgViewsPerPost: number;
  periodDays: number;
}

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    performanceScore: 92,
    totalBlogs: 0,
    totalViews: 0,
    avgViewsPerPost: 0,
    periodDays: 30
  });
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activitiesError, setActivitiesError] = useState('');
  const [analyticsError, setAnalyticsError] = useState('');

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        setLoading(true);
        const statsResponse = await dashboardService.getStats();
        console.log('Dashboard stats response:', statsResponse);
        
        // Transform API data to match our component
        const transformedStats = statsResponse.data?.map((stat: any) => ({
          id: stat.id,
          title: stat.label,
          value: stat.value?.toString() || '0',
          change: stat.change,
          changeType: stat.changeType === 'increase' ? 'positive' as const : 'neutral' as const,
          icon: iconMap[stat.icon as keyof typeof iconMap] || FileText,
          color: stat.color
        })) || [];

        setStats(transformedStats);
        setError('');

        // Fetch activities
        setActivitiesLoading(true);
        const activitiesResponse = await dashboardService.getRecentActivities();
        console.log('Dashboard activities response:', activitiesResponse);
        
        const transformedActivities = activitiesResponse.data?.map((activity: any) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: new Date(activity.time).toLocaleString(),
          user: activity.user,
          icon: iconMap[activity.icon as keyof typeof iconMap] || Edit,
          color: activity.color
        })) || [];

        setActivities(transformedActivities);
        setActivitiesError('');

        // Fetch analytics
        setAnalyticsLoading(true);
        const analyticsResponse = await dashboardService.getAnalytics();
        console.log('Dashboard analytics response:', analyticsResponse);
        
        if (analyticsResponse.data) {
          setAnalytics({
            performanceScore: analyticsResponse.data.performanceScore || 92,
            totalBlogs: analyticsResponse.data.summary?.totalBlogs || 0,
            totalViews: analyticsResponse.data.summary?.totalViews || 0,
            avgViewsPerPost: analyticsResponse.data.summary?.avgViewsPerPost || 0,
            periodDays: analyticsResponse.data.summary?.periodDays || 30
          });
        }
        setAnalyticsError('');
        
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Error loading dashboard data');
        setActivitiesError('Error loading activities');
        setAnalyticsError('Error loading analytics');
        // Use fallback data on error
        setStats(fallbackStats);
        setActivities(fallbackActivities);
      } finally {
        setLoading(false);
        setActivitiesLoading(false);
        setAnalyticsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fallback static stats for error cases
  const fallbackStats: DashboardStat[] = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Blog Posts',
      value: '18',
      change: '+5%',
      changeType: 'positive' as const, 
      icon: Edit,
      color: 'green'
    },
    {
      title: 'Messages',
      value: '47',
      change: '+23%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      color: 'purple'
    },
    {
      title: 'Page Views',
      value: '12.5K',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'yellow'
    }
  ];

  const fallbackActivities: Activity[] = [
    {
      id: '1',
      type: 'project',
      title: 'New project added',
      description: 'E-commerce Platform was added to portfolio',
      time: '2 hours ago',
      user: 'Admin',
      icon: Plus,
      color: 'green'
    },
    {
      id: '2',
      type: 'blog',
      title: 'Blog post published',
      description: 'React Best Practices was published',
      time: '5 hours ago',
      user: 'Admin',
      icon: Edit,
      color: 'blue'
    },
    {
      id: '3',
      type: 'message',
      title: 'New contact inquiry received',
      description: 'John Doe sent a message about web development',
      time: '1 day ago',
      user: 'John Doe',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      id: '4',
      type: 'testimonial',
      title: 'New testimonial received',
      description: 'Sarah Johnson left a positive review',
      time: '2 days ago',
      user: 'Sarah Johnson',
      icon: Star,
      color: 'yellow'
    }
  ];

  // Dynamic quick actions with counts from stats
  const quickActions = [
    {
      title: 'Add New Project',
      description: `${stats.find(s => s.title === 'Total Projects')?.value || '0'} projects total`,
      icon: Plus,
      color: 'blue',
      href: '/admin/portfolio'
    },
    {
      title: 'Write Blog Post', 
      description: `${stats.find(s => s.title === 'Blog Posts')?.value || '0'} posts published`,
      icon: Edit,
      color: 'green',
      href: '/admin/blog'
    },
    {
      title: 'View Messages',
      description: `${stats.find(s => s.title === 'Messages')?.value || '0'} messages received`,
      icon: MessageSquare,
      color: 'purple',
      href: '/admin/contact'
    },
    {
      title: 'Manage Pages',
      description: 'Update SEO and page content',
      icon: Star,
      color: 'yellow',
      href: '/admin/pages'
    },
    {
      title: 'View Analytics',
      description: `${analytics.performanceScore}% performance score`,
      icon: BarChart3,
      color: 'orange',
      href: '/admin/analytics'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Portfolio Admin</title>
      </Helmet>

      <AdminLayout>
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="mt-2 text-gray-600">
                Welcome back! Here's what's happening with your portfolio.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-4 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium">Error Loading Statistics</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
          ) : (
            // Success state
            stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <div className={`flex items-center mt-2 text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {stat.change} from last month
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      stat.color === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        stat.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-500">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activitiesLoading ? (
                    // Loading state for activities
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-start space-x-4 animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : activitiesError ? (
                    <div className="text-center py-4">
                      <p className="text-red-600 text-sm">{activitiesError}</p>
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${
                            activity.color === 'green' ? 'bg-green-100' :
                            activity.color === 'blue' ? 'bg-blue-100' :
                            activity.color === 'purple' ? 'bg-purple-100' :
                            activity.color === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              activity.color === 'green' ? 'text-green-600' :
                              activity.color === 'blue' ? 'text-blue-600' :
                              activity.color === 'purple' ? 'text-purple-600' :
                              activity.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.time} by {activity.user}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No recent activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                          <action.icon className={`w-4 h-4 text-${action.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-6">
              {analyticsLoading ? (
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 bg-blue-300 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-blue-300 rounded w-24"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 bg-blue-300 rounded w-16 mb-2"></div>
                      <div className="h-4 bg-blue-300 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-4 bg-blue-300 rounded w-48"></div>
                </div>
              ) : analyticsError ? (
                <div className="text-center py-4">
                  <p className="text-blue-100 text-sm">{analyticsError}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Site Performance</h3>
                      <p className="text-blue-100 mt-1">Overall Score</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{analytics.performanceScore}%</div>
                      <div className="text-blue-100 text-sm">
                        {analytics.performanceScore >= 90 ? 'Excellent' : 
                         analytics.performanceScore >= 70 ? 'Good' : 
                         analytics.performanceScore >= 50 ? 'Fair' : 'Poor'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-200" />
                      <span className="text-sm text-blue-100">All systems operational</span>
                    </div>
                    <div className="text-sm text-blue-100">
                      {analytics.totalBlogs} posts • {analytics.totalViews} total views
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Traffic Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Website Traffic</h3>
              <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart placeholder</p>
                <p className="text-sm">Traffic analytics will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Portfolio</p>
                  <p className="text-sm text-gray-500">2,847 views</p>
                </div>
                <span className="text-green-600 text-sm font-medium">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Blog</p>
                  <p className="text-sm text-gray-500">1,923 views</p>
                </div>
                <span className="text-green-600 text-sm font-medium">+8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">About</p>
                  <p className="text-sm text-gray-500">1,456 views</p>
                </div>
                <span className="text-green-600 text-sm font-medium">+5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Contact</p>
                  <p className="text-sm text-gray-500">987 views</p>
                </div>
                <span className="text-red-600 text-sm font-medium">-2%</span>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};