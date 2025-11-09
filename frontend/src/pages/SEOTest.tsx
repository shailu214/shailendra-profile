import React, { useState } from 'react';
import { YoastSEOAnalyzer } from '../components/admin/YoastSEOAnalyzer';

const SEOTest: React.FC = () => {
  // Test data with varying completeness to demonstrate all 16 parameters
  const [testScenarios] = useState([
    {
      name: "Perfect SEO Content",
      data: {
        title: "Best React Portfolio Development Tips - Complete Guide",
        metaDescription: "Learn essential React portfolio development tips with our complete guide. Master modern web development techniques and create stunning portfolios today.",
        keyphrase: "React portfolio development",
        content: `
          <h1>React Portfolio Development: The Complete Guide</h1>
          
          <p>React portfolio development has become increasingly important in today's competitive job market. However, creating an effective portfolio requires careful planning and attention to detail. Moreover, understanding the key principles will help you build something truly outstanding.</p>
          
          <p>Furthermore, modern React portfolio development involves several crucial components. Additionally, you need to consider user experience, performance optimization, and SEO best practices. Therefore, this guide will walk you through each essential step.</p>
          
          <h2>Essential Features for React Portfolio Development</h2>
          
          <p>When building your React portfolio development project, consider these important features. Consequently, your portfolio will stand out from the competition:</p>
          
          <ul>
            <li>Responsive design that works on all devices</li>
            <li>Fast loading times and optimized performance</li>
            <li>Clear navigation and user-friendly interface</li>
          </ul>
          
          <p>Nevertheless, the most important aspect is showcasing your skills effectively. Subsequently, potential employers can quickly assess your capabilities.</p>
          
          <h3>Advanced Techniques in React Portfolio Development</h3>
          
          <p>Advanced React portfolio development techniques include state management with Redux. Similarly, implementing smooth animations enhances user experience. Specifically, Framer Motion provides excellent animation capabilities.</p>
          
          <img src="/portfolio-example.jpg" alt="React portfolio development example showing modern design" />
          
          <p>In conclusion, React portfolio development requires dedication and continuous learning. Finally, remember that practice makes perfect in web development.</p>
          
          <p>Visit our <a href="/blog">blog</a> for more React tips. Also check out this <a href="https://reactjs.org/docs">official React documentation</a> for detailed information.</p>
        `
      }
    },
    {
      name: "Poor SEO Content",
      data: {
        title: "My Site",
        metaDescription: "Welcome to my website",
        keyphrase: "web development",
        content: `
          <h1>Welcome</h1>
          <p>This is my website. I made it with React.</p>
          <p>I hope you like it. It has some cool features that I built myself.</p>
        `
      }
    },
    {
      name: "Medium SEO Content", 
      data: {
        title: "Web Development Services and Solutions",
        metaDescription: "Professional web development services including React, Node.js, and full-stack solutions for modern businesses.",
        keyphrase: "web development services",
        content: `
          <h1>Professional Web Development Services</h1>
          
          <p>Our web development services provide comprehensive solutions for modern businesses. We specialize in creating responsive, user-friendly websites.</p>
          
          <p>We offer various web development services including frontend development, backend APIs, and database integration. Our team uses the latest technologies.</p>
          
          <h2>Our Web Development Services Include</h2>
          
          <p>React development for interactive user interfaces. Node.js backend development for robust server solutions. Full-stack web development services for complete projects.</p>
          
          <img src="/services.jpg" alt="Web development team working on projects" />
          
          <p>Contact us to learn more about our web development services and how we can help your business grow online.</p>
          
          <a href="/contact">Get in touch</a> for a consultation.
        `
      }
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 YoastSEOAnalyzer Test Suite
          </h1>
          
          <p className="text-gray-600 mb-6">
            Test all 16 Yoast SEO parameters with different content scenarios to see real-time analysis in action.
          </p>

          {/* Scenario Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose Test Scenario:</h2>
            <div className="flex flex-wrap gap-4">
              {testScenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScenario(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedScenario === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current Scenario Info */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Current Scenario: {testScenarios[selectedScenario].name}
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Title:</strong> {testScenarios[selectedScenario].data.title}</p>
              <p><strong>Meta Description:</strong> {testScenarios[selectedScenario].data.metaDescription}</p>
              <p><strong>Focus Keyphrase:</strong> {testScenarios[selectedScenario].data.keyphrase}</p>
              <p><strong>Content Length:</strong> {testScenarios[selectedScenario].data.content.length} characters</p>
            </div>
          </div>

          {/* SEO Analyzer */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">🔍 Live SEO Analysis Results</h2>
            <YoastSEOAnalyzer
              title={testScenarios[selectedScenario].data.title}
              metaDescription={testScenarios[selectedScenario].data.metaDescription}
              keyphrase={testScenarios[selectedScenario].data.keyphrase}
              content={testScenarios[selectedScenario].data.content}
            />
          </div>

          {/* Parameter Documentation */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">📋 All 16 Yoast SEO Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                "1. SEO Title (50-60 characters, includes focus keyword)",
                "2. Meta Description (under 160 characters, includes focus keyword)",
                "3. Focus Keyphrase (relevant and used effectively)",
                "4. Keyword in Title",
                "5. Keyword in Meta Description", 
                "6. Keyword in First Paragraph",
                "7. Image Alt Text",
                "8. Internal Links",
                "9. External Links",
                "10. Text Length (over 300 words)",
                "11. Paragraph Length (under 150 words each)",
                "12. Subheadings (H2, H3)",
                "13. Readable Content",
                "14. Transition Words (at least 30%)",
                "15. Passive Voice (no more than 10%)",
                "16. Keyphrase in Image Alt Text"
              ].map((param, index) => (
                <div key={index} className="p-3 bg-gray-100 rounded">
                  {param}
                </div>
              ))}
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">✅ Testing Instructions</h3>
            <ul className="text-green-800 space-y-2 text-sm">
              <li>• <strong>Perfect SEO:</strong> Shows mostly green indicators with comprehensive content</li>
              <li>• <strong>Poor SEO:</strong> Shows mostly red indicators with minimal content</li>
              <li>• <strong>Medium SEO:</strong> Shows mixed results with room for improvement</li>
              <li>• All 16 parameters are analyzed in real-time based on actual content</li>
              <li>• External link detection works with real HTML parsing</li>
              <li>• Keyphrase analysis checks multiple content locations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOTest;