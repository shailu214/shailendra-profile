import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  Mail,
  Reply,
  Trash2,
  Star,
  Search,
  Filter,
  Calendar,
  Phone,
  Globe,
  MessageCircle,
  Check,
  AlertCircle,
  Clock,
  Archive,
  MoreHorizontal
} from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied' | 'Archived';
  priority: 'Low' | 'Medium' | 'High';
  receivedDate: string;
  repliedDate?: string;
  isStarred: boolean;
  source: 'Contact Form' | 'Email' | 'LinkedIn' | 'WhatsApp';
}

export const AdminMessages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);

  const messages: Message[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@company.com',
      phone: '+1 (555) 123-4567',
      website: 'https://company.com',
      subject: 'Project Inquiry - E-commerce Platform',
      message: 'Hi Shailendra, I came across your portfolio and I\'m impressed with your work. We are looking to build a modern e-commerce platform using React and Node.js. Could we schedule a call to discuss the project requirements and timeline?',
      status: 'Unread',
      priority: 'High',
      receivedDate: '2024-03-15T10:30:00',
      isStarred: true,
      source: 'Contact Form'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@startup.com',
      subject: 'Collaboration Opportunity',
      message: 'Hello! I\'m the CTO at a growing startup and we\'re looking for a senior React developer to join our team for a 6-month contract. Your experience with full-stack development aligns perfectly with what we need.',
      status: 'Read',
      priority: 'Medium',
      receivedDate: '2024-03-14T14:45:00',
      isStarred: false,
      source: 'LinkedIn'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike@techsolutions.com',
      phone: '+1 (555) 987-6543',
      subject: 'Website Redesign Quote Request',
      message: 'We need to redesign our company website and add new features. Can you provide a quote for the work? We\'re looking at a timeline of 8-10 weeks.',
      status: 'Replied',
      priority: 'Medium',
      receivedDate: '2024-03-13T09:15:00',
      repliedDate: '2024-03-13T16:30:00',
      isStarred: false,
      source: 'Contact Form'
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa@designagency.com',
      subject: 'Partnership Proposal',
      message: 'Hi, I run a design agency and we often need reliable developers for our client projects. Would you be interested in a partnership where we handle design and you handle development?',
      status: 'Archived',
      priority: 'Low',
      receivedDate: '2024-03-12T11:20:00',
      isStarred: false,
      source: 'Email'
    },
    {
      id: 5,
      name: 'David Kumar',
      email: 'david@webapp.com',
      subject: 'Mobile App Development',
      message: 'We need a React Native developer for our mobile app project. The app will have authentication, real-time chat, and payment integration. Are you available for a 12-week project?',
      status: 'Read',
      priority: 'High',
      receivedDate: '2024-03-11T16:00:00',
      isStarred: true,
      source: 'Contact Form'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unread':
        return 'bg-blue-100 text-blue-800';
      case 'Read':
        return 'bg-gray-100 text-gray-800';
      case 'Replied':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status.toLowerCase() === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority.toLowerCase() === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages & Inquiries</h1>
            <p className="mt-2 text-gray-600">
              Manage contact form submissions and client inquiries.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Reply className="w-4 h-4 mr-2" />
              Compose
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'Unread').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-3xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'Replied').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">87%</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {message.name.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority} Priority
                      </span>
                      {message.isStarred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{message.source}</span>
                  </div>
                  
                  <h4 className="text-md font-medium text-gray-800 mb-2">{message.subject}</h4>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{message.message}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                    {message.website && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <a href={message.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(message.receivedDate).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {message.repliedDate && (
                    <div className="mt-2 text-sm text-green-600">
                      Replied on {new Date(message.repliedDate).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Reply className="w-4 h-4" />
                </button>
                <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Archive className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </AdminLayout>
  );
};