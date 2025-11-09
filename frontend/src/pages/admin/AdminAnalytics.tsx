import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const analyticsData = {
    overview: {
      totalVisitors: 12543,
      pageViews: 34567,
      bounceRate: 42.3,
      avgSessionDuration: '2m 34s',
      conversionRate: 3.2
    },
    traffic: [
      { source: 'Organic Search', visitors: 4521, percentage: 36.1, change: 12.5 },
      { source: 'Direct', visitors: 3254, percentage: 25.9, change: -2.3 },
      { source: 'Social Media', visitors: 2134, percentage: 17.0, change: 8.7 },
      { source: 'Referral', visitors: 1987, percentage: 15.8, change: 5.2 },
      { source: 'Email', visitors: 647, percentage: 5.2, change: -1.2 }
    ],
    topPages: [
      { page: '/', views: 8750, percentage: 25.3 },
      { page: '/portfolio', views: 6234, percentage: 18.0 },
      { page: '/about', views: 4567, percentage: 13.2 },
      { page: '/blog', views: 3890, percentage: 11.2 },
      { page: '/contact', views: 2345, percentage: 6.8 }
    ],
    devices: [
      { device: 'Desktop', users: 7526, percentage: 60.0 },
      { device: 'Mobile', users: 3761, percentage: 30.0 },
      { device: 'Tablet', users: 1256, percentage: 10.0 }
    ],
    locations: [
      { country: 'United States', users: 4521, percentage: 36.1 },
      { country: 'India', users: 2134, percentage: 17.0 },
      { country: 'United Kingdom', users: 1567, percentage: 12.5 },
      { country: 'Canada', users: 1234, percentage: 9.8 },
      { country: 'Germany', users: 987, percentage: 7.9 }
    ]
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Track your website performance and visitor insights.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalVisitors.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                +12.3%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.pageViews.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                +8.7%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.bounceRate}%</p>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <ArrowDown className="w-4 h-4 mr-1" />
                -2.1%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.avgSessionDuration}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                +15.2%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                +0.8%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {analyticsData.traffic.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{source.visitors.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">({source.percentage}%)</span>
                  <div className={`flex items-center text-sm ${source.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {source.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(source.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Pages</h2>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{page.page}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{page.views.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">({page.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Device Usage</h2>
          <div className="space-y-4">
            {analyticsData.devices.map((device, index) => {
              const DeviceIcon = device.device === 'Desktop' ? Monitor : 
                                device.device === 'Mobile' ? Smartphone : Monitor;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DeviceIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{device.users.toLocaleString()}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-10">{device.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Countries</h2>
          <div className="space-y-4">
            {analyticsData.locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{location.country}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{location.users.toLocaleString()}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-10">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Website Traffic Over Time</h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Traffic Chart</h3>
            <p className="text-sm">Interactive chart would be displayed here</p>
            <p className="text-sm mt-2">Integration with Chart.js or similar library</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};