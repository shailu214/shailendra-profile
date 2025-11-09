import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';
import { ProfileProvider } from './context/ProfileContext';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { PortfolioDetail } from './pages/PortfolioDetail';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard2';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminPortfolio } from './pages/admin/AdminPortfolio';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSiteSettings } from './pages/admin/AdminSiteSettings';
import AdminPages from './pages/admin/AdminPages';
import { AdminBlogCategories } from './pages/admin/AdminBlogCategories';
import { NotFound } from './pages/NotFound';
import SEOTest from './pages/SEOTest';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import './App.css'

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminRoute ? (
        <Routes>
          {/* Admin Routes - No main layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/portfolio" element={<AdminPortfolio />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/blog/categories" element={<AdminBlogCategories />} />
          <Route path="/admin/settings" element={<AdminSiteSettings />} />
          
          {/* 404 Route for admin */}
          <Route path="/admin/*" element={<NotFound />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            {/* Public Routes - With main layout */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/seo-test" element={<SEOTest />} />
            
            {/* 404 Route for public */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <ProfileProvider>
          <ThemeProvider>
            <AuthProvider>
              <Router>
                <AppContent />
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </ProfileProvider>
      </SettingsProvider>
    </HelmetProvider>
  )
}

export default App
