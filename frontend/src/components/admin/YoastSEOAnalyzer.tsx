import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface SEOCheck {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  score: number;
}

interface SEOAnalysis {
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  checks: SEOCheck[];
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

interface YoastSEOAnalyzerProps {
  title: string;
  description: string;
  content: string;
  keyphrase: string;
}

export const YoastSEOAnalyzer: React.FC<YoastSEOAnalyzerProps> = ({
  title,
  description,
  content,
  keyphrase
}) => {
  // Helper function to extract text from HTML
  const extractTextFromHTML = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Helper function to extract headings from HTML description
  const extractHeadings = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    
    return {
      h1: title ? [title] : [], // H1 comes from title field
      h2: Array.from(div.querySelectorAll('h2')).map(h => h.textContent || ''),
      h3: Array.from(div.querySelectorAll('h3')).map(h => h.textContent || '')
    };
  };

  // Helper function to extract links from content
  const extractLinks = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const links = Array.from(div.querySelectorAll('a'));
    
    return {
      internal: links.filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('/') || 
               href.startsWith('#') || 
               href.includes('localhost') || 
               href.includes('127.0.0.1') ||
               (!href.startsWith('http') && !href.includes('://'));
      }),
      external: links.filter(link => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('http') && 
               !href.includes('localhost') && 
               !href.includes('127.0.0.1') &&
               !href.includes(window.location.hostname);
      })
    };
  };

  const analyzeYoastSEO = (): SEOAnalysis => {
    const checks: SEOCheck[] = [];
    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;

    // Extract content and prepare for analysis
    const headings = extractHeadings(description);
    const links = extractLinks(content + description);
    const contentText = extractTextFromHTML(content);
    const metaDescription = extractTextFromHTML(description);
    const allTextContent = `${contentText} ${metaDescription}`;
    const allContent = `${title} ${allTextContent}`;
    const words = allContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Extract first 100 words for keyphrase analysis
    const firstHundredWords = allTextContent.trim().split(/\s+/).slice(0, 100).join(' ');
    
    // Extract images for alt text analysis
    const allHtmlContent = content + description;
    const imageMatches = allHtmlContent.match(/<img[^>]*>/gi) || [];
    // Extract alt text from images for analysis (future use)
    // const imageAlts = imageMatches.map(img => {
    //   const altMatch = img.match(/alt\s*=\s*["']([^"']*)["']/i);
    //   return altMatch ? altMatch[1] : '';
    // });

    // Readability analysis
    const sentences = allTextContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = allTextContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // === YOAST SEO 16 PARAMETERS ANALYSIS ===

    // 1. SEO Title (50-60 characters, includes focus keyword)
    if (!title || title.trim() === '') {
      checks.push({
        id: 'seo-title',
        name: '1. SEO Title',
        status: 'fail',
        message: '🔴 No SEO title found. Add a compelling title (50-60 characters) with your focus keyphrase.',
        score: 0
      });
      redCount++;
    } else if (title.length >= 50 && title.length <= 60 && keyphrase && title.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'seo-title',
        name: '1. SEO Title',
        status: 'pass',
        message: `🟢 Perfect! Title is ${title.length} characters and includes focus keyphrase.`,
        score: 1
      });
      greenCount++;
    } else if ((title.length < 50 || title.length > 60) && keyphrase && title.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'seo-title',
        name: '1. SEO Title',
        status: 'warning',
        message: `🟡 Title includes keyphrase but is ${title.length} characters. Optimize to 50-60 characters.`,
        score: 0.5
      });
      yellowCount++;
    } else if (title.length >= 50 && title.length <= 60) {
      checks.push({
        id: 'seo-title',
        name: '1. SEO Title',
        status: 'warning',
        message: `🟡 Title length is good (${title.length} characters) but missing focus keyphrase.`,
        score: 0.5
      });
      yellowCount++;
    } else {
      checks.push({
        id: 'seo-title',
        name: '1. SEO Title',
        status: 'fail',
        message: `🔴 Title needs optimization: ${title.length} characters, ${!keyphrase || !title.toLowerCase().includes(keyphrase.toLowerCase()) ? 'missing keyphrase' : 'wrong length'}.`,
        score: 0
      });
      redCount++;
    }

    // 2. Meta Description (under 160 characters, includes focus keyword)
    if (!metaDescription || metaDescription.trim() === '') {
      checks.push({
        id: 'meta-description',
        name: '2. Meta Description',
        status: 'fail',
        message: '🔴 No meta description found. Add a compelling description under 160 characters with your focus keyphrase.',
        score: 0
      });
      redCount++;
    } else if (metaDescription.length <= 160 && keyphrase && metaDescription.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'meta-description',
        name: '2. Meta Description',
        status: 'pass',
        message: `🟢 Perfect! Meta description is ${metaDescription.length} characters and includes focus keyphrase.`,
        score: 1
      });
      greenCount++;
    } else if (metaDescription.length > 160 && keyphrase && metaDescription.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'meta-description',
        name: '2. Meta Description',
        status: 'warning',
        message: `🟡 Meta description includes keyphrase but is too long (${metaDescription.length} characters). Keep under 160.`,
        score: 0.5
      });
      yellowCount++;
    } else if (metaDescription.length <= 160) {
      checks.push({
        id: 'meta-description',
        name: '2. Meta Description',
        status: 'warning',
        message: `🟡 Meta description length is good (${metaDescription.length} characters) but missing focus keyphrase.`,
        score: 0.5
      });
      yellowCount++;
    } else {
      checks.push({
        id: 'meta-description',
        name: '2. Meta Description',
        status: 'fail',
        message: `🔴 Meta description is too long (${metaDescription.length} characters) and ${!keyphrase || !metaDescription.toLowerCase().includes(keyphrase.toLowerCase()) ? 'missing keyphrase' : 'needs keyphrase'}.`,
        score: 0
      });
      redCount++;
    }

    // 3. Focus Keyphrase (relevant and used effectively)
    if (!keyphrase || keyphrase.trim() === '') {
      checks.push({
        id: 'focus-keyphrase',
        name: '3. Focus Keyphrase',
        status: 'fail',
        message: '🔴 No focus keyphrase set. Add a target keyphrase to optimize your content.',
        score: 0
      });
      redCount++;
    } else {
      const keyphraseWords = keyphrase.trim().split(/\s+/).length;
      if (keyphraseWords >= 1 && keyphraseWords <= 4) {
        checks.push({
          id: 'focus-keyphrase',
          name: '3. Focus Keyphrase',
          status: 'pass',
          message: `🟢 Focus keyphrase "${keyphrase}" is well-formed (${keyphraseWords} words).`,
          score: 1
        });
        greenCount++;
      } else {
        checks.push({
          id: 'focus-keyphrase',
          name: '3. Focus Keyphrase',
          status: 'warning',
          message: `🟡 Focus keyphrase "${keyphrase}" has ${keyphraseWords} words. Use 1-4 words for best results.`,
          score: 0.5
        });
        yellowCount++;
      }
    }

    // 4. Keyword in Title
    if (!keyphrase || keyphrase.trim() === '') {
      checks.push({
        id: 'keyword-in-title',
        name: '4. Keyword in Title',
        status: 'fail',
        message: '🔴 Set a focus keyphrase to analyze keyword presence in title.',
        score: 0
      });
      redCount++;
    } else if (title && title.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'keyword-in-title',
        name: '4. Keyword in Title',
        status: 'pass',
        message: `🟢 Focus keyphrase appears in the title.`,
        score: 1
      });
      greenCount++;
    } else {
      checks.push({
        id: 'keyword-in-title',
        name: '4. Keyword in Title',
        status: 'fail',
        message: `🔴 Focus keyphrase "${keyphrase}" does not appear in the title. Include it for better SEO.`,
        score: 0
      });
      redCount++;
    }

    // 5. Keyword in Meta Description
    if (!keyphrase || keyphrase.trim() === '') {
      checks.push({
        id: 'keyword-in-meta-description',
        name: '5. Keyword in Meta Description',
        status: 'fail',
        message: '🔴 Set a focus keyphrase to analyze keyword presence in meta description.',
        score: 0
      });
      redCount++;
    } else if (metaDescription && metaDescription.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'keyword-in-meta-description',
        name: '5. Keyword in Meta Description',
        status: 'pass',
        message: `🟢 Focus keyphrase appears in the meta description.`,
        score: 1
      });
      greenCount++;
    } else {
      checks.push({
        id: 'keyword-in-meta-description',
        name: '5. Keyword in Meta Description',
        status: 'fail',
        message: `🔴 Focus keyphrase "${keyphrase}" does not appear in the meta description. Include it for better SEO.`,
        score: 0
      });
      redCount++;
    }

    // 6. Keyword in First Paragraph (first 100 words)
    if (!keyphrase || keyphrase.trim() === '') {
      checks.push({
        id: 'keyword-in-first-paragraph',
        name: '6. Keyword in First Paragraph',
        status: 'fail',
        message: '🔴 Set a focus keyphrase to analyze keyword presence in first paragraph.',
        score: 0
      });
      redCount++;
    } else if (firstHundredWords && firstHundredWords.toLowerCase().includes(keyphrase.toLowerCase())) {
      checks.push({
        id: 'keyword-in-first-paragraph',
        name: '6. Keyword in First Paragraph',
        status: 'pass',
        message: `🟢 Focus keyphrase appears in the first 100 words.`,
        score: 1
      });
      greenCount++;
    } else {
      checks.push({
        id: 'keyword-in-first-paragraph',
        name: '6. Keyword in First Paragraph',
        status: 'fail',
        message: `🔴 Focus keyphrase "${keyphrase}" does not appear in the first 100 words. Include it early in your content.`,
        score: 0
      });
      redCount++;
    }

    // 7. Image Alt Text
    if (imageMatches.length === 0) {
      checks.push({
        id: 'image-alt-text',
        name: '7. Image Alt Text',
        status: 'warning',
        message: '🟡 No images found. Consider adding relevant images with descriptive alt text.',
        score: 0.5
      });
      yellowCount++;
    } else {
      const imagesWithoutAlt = imageMatches.filter(img => 
        !img.match(/alt\s*=\s*["'][^"']*["']/i) || 
        img.match(/alt\s*=\s*["']\s*["']/i) // Empty alt
      );
      
      if (imagesWithoutAlt.length === 0) {
        checks.push({
          id: 'image-alt-text',
          name: '7. Image Alt Text',
          status: 'pass',
          message: `🟢 All ${imageMatches.length} image(s) have descriptive alt text.`,
          score: 1
        });
        greenCount++;
      } else {
        checks.push({
          id: 'image-alt-text',
          name: '7. Image Alt Text',
          status: 'fail',
          message: `🔴 ${imagesWithoutAlt.length} of ${imageMatches.length} images missing alt text. Add descriptive alt text for accessibility and SEO.`,
          score: 0
        });
        redCount++;
      }
    }

    // 8. Internal Links
    if (links.internal.length === 0) {
      checks.push({
        id: 'internal-links',
        name: '8. Internal Links',
        status: 'fail',
        message: '🔴 No internal links found. Add at least one link to other relevant pages on your website.',
        score: 0
      });
      redCount++;
    } else {
      checks.push({
        id: 'internal-links',
        name: '8. Internal Links',
        status: 'pass',
        message: `🟢 Found ${links.internal.length} internal link(s) to relevant pages.`,
        score: 1
      });
      greenCount++;
    }

    // 9. External Links (Outbound Links)
    if (links.external.length === 0) {
      checks.push({
        id: 'external-links',
        name: '9. External Links',
        status: 'fail',
        message: '🔴 No external links found. Add at least one relevant external link to a credible source.',
        score: 0
      });
      redCount++;
    } else {
      checks.push({
        id: 'external-links',
        name: '9. External Links',
        status: 'pass',
        message: `🟢 Found ${links.external.length} external link(s) to credible sources.`,
        score: 1
      });
      greenCount++;
    }

    // 10. Text Length (over 300 words)
    if (wordCount < 300) {
      checks.push({
        id: 'text-length',
        name: '10. Text Length',
        status: 'fail',
        message: `🔴 Content is only ${wordCount} words. Add more content to reach at least 300 words for better SEO value.`,
        score: 0
      });
      redCount++;
    } else {
      checks.push({
        id: 'text-length',
        name: '10. Text Length',
        status: 'pass',
        message: `🟢 Content has ${wordCount} words, which meets the minimum requirement.`,
        score: 1
      });
      greenCount++;
    }

    // 11. Paragraph Length (under 150 words each)
    const longParagraphs = paragraphs.filter(p => {
      const pWords = p.split(/\s+/).length;
      return pWords > 150;
    }).length;
    
    if (paragraphs.length === 0) {
      checks.push({
        id: 'paragraph-length',
        name: '11. Paragraph Length',
        status: 'warning',
        message: '🟡 No clear paragraph structure detected. Organize content into paragraphs.',
        score: 0.5
      });
      yellowCount++;
    } else if (longParagraphs === 0) {
      checks.push({
        id: 'paragraph-length',
        name: '11. Paragraph Length',
        status: 'pass',
        message: `🟢 All paragraphs are concise and easy to read (under 150 words each).`,
        score: 1
      });
      greenCount++;
    } else if (longParagraphs <= paragraphs.length / 2) {
      checks.push({
        id: 'paragraph-length',
        name: '11. Paragraph Length',
        status: 'warning',
        message: `🟡 ${longParagraphs} paragraph(s) are too long. Consider breaking them into shorter paragraphs for better readability.`,
        score: 0.5
      });
      yellowCount++;
    } else {
      checks.push({
        id: 'paragraph-length',
        name: '11. Paragraph Length',
        status: 'fail',
        message: `🔴 ${longParagraphs} of ${paragraphs.length} paragraphs are too long (over 150 words). Break them up for better readability.`,
        score: 0
      });
      redCount++;
    }

    // 12. Subheadings (H2, H3) - proper use with relevant keywords
    const totalSubheadings = headings.h2.length + headings.h3.length;
    if (wordCount < 300) {
      checks.push({
        id: 'subheadings',
        name: '12. Subheadings (H2, H3)',
        status: 'pass',
        message: `🟢 Content is short enough (${wordCount} words) - subheadings not critical.`,
        score: 1
      });
      greenCount++;
    } else if (totalSubheadings === 0) {
      checks.push({
        id: 'subheadings',
        name: '12. Subheadings (H2, H3)',
        status: 'fail',
        message: `🔴 No subheadings found. Add H2/H3 headings to structure your ${wordCount}-word content.`,
        score: 0
      });
      redCount++;
    } else {
      const keyphraseInHeadings = keyphrase ? 
        headings.h2.concat(headings.h3).some(h => h.toLowerCase().includes(keyphrase.toLowerCase())) : false;
      
      if (keyphraseInHeadings) {
        checks.push({
          id: 'subheadings',
          name: '12. Subheadings (H2, H3)',
          status: 'pass',
          message: `🟢 Found ${totalSubheadings} subheading(s) with focus keyphrase included.`,
          score: 1
        });
        greenCount++;
      } else if (keyphrase) {
        checks.push({
          id: 'subheadings',
          name: '12. Subheadings (H2, H3)',
          status: 'warning',
          message: `🟡 Found ${totalSubheadings} subheading(s) but none contain the focus keyphrase. Include your keyphrase in relevant headings.`,
          score: 0.5
        });
        yellowCount++;
      } else {
        checks.push({
          id: 'subheadings',
          name: '12. Subheadings (H2, H3)',
          status: 'warning',
          message: `🟡 Found ${totalSubheadings} subheading(s). Set a focus keyphrase to analyze keyword usage in headings.`,
          score: 0.5
        });
        yellowCount++;
      }
    }

    // 13. Readable Content (based on sentence structure and clarity)
    if (sentences.length === 0) {
      checks.push({
        id: 'readable-content',
        name: '13. Readable Content',
        status: 'fail',
        message: '🔴 No sentences detected. Add clear, readable content.',
        score: 0
      });
      redCount++;
    } else {
      const avgWordsPerSentence = wordCount / sentences.length;
      const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 20).length;
      
      if (avgWordsPerSentence <= 20 && longSentences <= sentences.length * 0.25) {
        checks.push({
          id: 'readable-content',
          name: '13. Readable Content',
          status: 'pass',
          message: `🟢 Content is easy to read (avg ${Math.round(avgWordsPerSentence)} words per sentence).`,
          score: 1
        });
        greenCount++;
      } else {
        checks.push({
          id: 'readable-content',
          name: '13. Readable Content',
          status: 'warning',
          message: `🟡 Readability could be improved. ${longSentences} sentences are too long (over 20 words).`,
          score: 0.5
        });
        yellowCount++;
      }
    }

    // 14. Transition Words (at least 30% of content)
    const transitionWords = /\b(however|moreover|furthermore|additionally|consequently|therefore|meanwhile|subsequently|nevertheless|nonetheless|thus|hence|accordingly|likewise|similarly|conversely|alternatively|specifically|particularly|especially|notably|significantly|importantly|ultimately|finally|initially|previously|currently|recently|frequently|occasionally|simultaneously|immediately|eventually|gradually|suddenly|certainly|obviously|clearly|definitely|probably|possibly|perhaps|maybe|indeed|actually|essentially|basically|generally|typically|usually|often|sometimes|rarely|never|always|still|yet|already|just|only|even|also|too|as well|in addition|on the other hand|in contrast|in comparison|for example|for instance|such as|including|excluding|except|besides|apart from|due to|because of|as a result|in conclusion|to sum up|in summary|overall|in general)\b/gi;
    const transitionMatches = allTextContent.match(transitionWords) || [];
    const transitionPercentage = sentences.length > 0 ? (transitionMatches.length / sentences.length) * 100 : 0;
    
    if (transitionPercentage >= 30) {
      checks.push({
        id: 'transition-words',
        name: '14. Transition Words',
        status: 'pass',
        message: `🟢 Great use of transition words (${Math.round(transitionPercentage)}% of sentences).`,
        score: 1
      });
      greenCount++;
    } else if (transitionPercentage >= 20) {
      checks.push({
        id: 'transition-words',
        name: '14. Transition Words',
        status: 'warning',
        message: `🟡 Some transition words used (${Math.round(transitionPercentage)}%). Aim for 30% to improve flow.`,
        score: 0.5
      });
      yellowCount++;
    } else {
      checks.push({
        id: 'transition-words',
        name: '14. Transition Words',
        status: 'fail',
        message: `🔴 Too few transition words (${Math.round(transitionPercentage)}%). Add words like "however", "therefore", "moreover" to improve flow.`,
        score: 0
      });
      redCount++;
    }

    // 15. Passive Voice (no more than 10% of sentences)
    const passiveIndicators = /\b(was|were|is|are|been|being)\s+\w+ed\b/gi;
    const passiveMatches = allTextContent.match(passiveIndicators) || [];
    const passivePercentage = sentences.length > 0 ? (passiveMatches.length / sentences.length) * 100 : 0;
    
    if (passivePercentage <= 10) {
      checks.push({
        id: 'passive-voice',
        name: '15. Passive Voice',
        status: 'pass',
        message: `🟢 Excellent! Only ${Math.round(passivePercentage)}% passive voice (under 10% recommended).`,
        score: 1
      });
      greenCount++;
    } else if (passivePercentage <= 20) {
      checks.push({
        id: 'passive-voice',
        name: '15. Passive Voice',
        status: 'warning',
        message: `🟡 ${Math.round(passivePercentage)}% passive voice. Try to use more active voice (aim for under 10%).`,
        score: 0.5
      });
      yellowCount++;
    } else {
      checks.push({
        id: 'passive-voice',
        name: '15. Passive Voice',
        status: 'fail',
        message: `🔴 Too much passive voice (${Math.round(passivePercentage)}%). Use active voice for better readability (under 10% recommended).`,
        score: 0
      });
      redCount++;
    }

    // 16. Keyphrase in Image Alt Text (focus keyphrase in alt attributes)
    if (imageMatches.length === 0) {
      checks.push({
        id: 'keyphrase-in-alt',
        name: '16. Keyphrase in Image Alt Text',
        status: 'warning',
        message: '🟡 No images found. Consider adding relevant images with alt text containing your keyphrase.',
        score: 0.5
      });
      yellowCount++;
    } else if (!keyphrase || keyphrase.trim() === '') {
      checks.push({
        id: 'keyphrase-in-alt',
        name: '16. Keyphrase in Image Alt Text',
        status: 'warning',
        message: `� Found ${imageMatches.length} image(s). Set a focus keyphrase to analyze alt text optimization.`,
        score: 0.5
      });
      yellowCount++;
    } else {
      // Extract and analyze alt text for keyphrase
      const imageAlts = imageMatches.map(img => {
        const altMatch = img.match(/alt\s*=\s*["']([^"']*)["']/i);
        return altMatch ? altMatch[1] : '';
      });
      
      const keyphraseInAlts = imageAlts.some(alt => 
        alt.toLowerCase().includes(keyphrase.toLowerCase())
      );
      
      if (keyphraseInAlts) {
        checks.push({
          id: 'keyphrase-in-alt',
          name: '16. Keyphrase in Image Alt Text',
          status: 'pass',
          message: `🟢 Great! Your keyphrase appears in image alt attributes.`,
          score: 1
        });
        greenCount++;
      } else {
        checks.push({
          id: 'keyphrase-in-alt',
          name: '16. Keyphrase in Image Alt Text',
          status: 'fail',
          message: `� Images found but none have alt text containing "${keyphrase}". Add your keyphrase to relevant image alt attributes.`,
          score: 0
        });
        redCount++;
      }
    }

    // Calculate final score based on Yoast methodology
    const totalChecks = 16;
    const score = Math.round(((greenCount + (yellowCount * 0.5)) / totalChecks) * 100);
    
    let status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    if (score >= 80 && greenCount >= 12) status = 'excellent';
    else if (score >= 60 && greenCount >= 8) status = 'good';
    else if (score >= 40) status = 'needs-improvement';
    else status = 'poor';

    return {
      score,
      status,
      checks,
      greenCount,
      yellowCount,
      redCount
    };
  };

  const analysis = analyzeYoastSEO();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Yoast SEO Analysis</h3>
        <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
          {analysis.score}/100
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall SEO Score</span>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              🟢 {analysis.greenCount} | 🟡 {analysis.yellowCount} | 🔴 {analysis.redCount}
            </span>
            <span className={`text-sm font-medium ${getStatusColor(analysis.status)}`}>
              {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.score)}`}
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      {/* Individual Checks */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
          🎯 Yoast SEO 16-Point Analysis
        </h4>
        {analysis.checks.map((check) => (
          <div key={check.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(check.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-900">{check.name}</h5>
                <span className="text-xs text-gray-500">{check.score} pts</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{check.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Yoast SEO Methodology:</strong> This analysis follows the exact 16-parameter system used by Yoast SEO. 
          Green signals indicate optimal SEO, yellow signals suggest improvements, and red signals require immediate attention.
        </p>
      </div>
    </div>
  );
};

// Backward compatibility export
export { YoastSEOAnalyzer as SEOAnalyzer };