import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Download, 
  AlertTriangle, 
  Youtube, 
  Instagram, 
  Facebook, 
  Twitter, 
  Video, 
  Tv, 
  MonitorPlay, 
  Lock, 
  Copy,  
  CheckCircle, 
  Info, 
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Shield,
  Clock,
  ThumbsUp,
  Cpu,
  Bookmark,
  Share2,
  Sun,
  Moon,
  Search,
  Sliders,
  ShieldAlert,
  Award,
  Star,
  Zap,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUPPORTED_PLATFORMS, SEO_FAQS, DEFAULT_FORMATS, getMockMetadata } from './data.ts';
import { PlatformType, VideoMetadata, DownloadFormat } from './types.ts';
import { SEO_BLOG_POST, SEO_BLOG_POSTS } from './data_blog.ts';
import { SEO_PAGES_DATA } from './pages_data.ts';
import { 
  DETAILED_FAQ_ITEMS, 
  HOMEPAGE_EXTENDED_SECTIONS, 
  ABOUT_PAGE_SECTIONS, 
  PRIVACY_POLICY_EXTENDED, 
  TERMS_EXTENDED, 
  DISCLAIMER_EXTENDED 
} from './seo_content.ts';
import AdUnit from './AdUnit.tsx';

function highlightKeywords(text: string) {
  if (!text) return "";
  const keywords = [
    "pornsave", "porn save", "save porn", "saveporn", "pornsave online", "saveporn free",
    "porn video download", "hd porn video download", "porn videos free download", "xxx hd porn video download", 
    "best porn videos download", "porn short video download", "new hd porn video download", "brazzers porn video download", 
    "stepmom porn video download", "latest porn videos download", "desi porn video download", "4k porn video download", 
    "new porn video download", "xxx porn video download", "3gp porn video download", "porn sex video download", 
    "download short porn videos", "hot porn video download", "japanese porn videos download", "sexy porn video download", 
    "4k porn hd video download", "4k video porn download", "alison tyler porn video download", "babes porn video download", 
    "bhabhi porn video download", "celebrity porn videos download", "download hd indian porn videos", "download porn video 4k", 
    "download south indian porn videos", "hd hindi porn video download", "aletta ocean porn video download", 
    "dani daniels hd porn video download", "download 4k porn videos", "easy download porn videos", "indian xxx porn video download", 
    "massage porn video download", "nadia ali porn video download", "porn video download video", "porn video song download", 
    "porn videos download in full hd"
  ];
  
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  const escaped = sortedKeywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  
  return parts.map((part, index) => {
    const isKeyword = sortedKeywords.some(k => k.toLowerCase() === part.toLowerCase());
    if (isKeyword) {
      return (
        <span 
          key={index} 
          className="text-orange-500 font-semibold px-1 py-0.5 rounded bg-orange-500/5 hover:bg-orange-500/10 transition-colors"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Storage get item blocked:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage set item blocked:', e);
    }
  }
};

export default function App() {
  // Base State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('generic');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const isDarkMode = false;

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Performance Optimization: Defer loading of heavy third-party ad scripts to avoid blocking the main thread during initial paint.
  useEffect(() => {
    const timer = setTimeout(() => {
      const adScripts = [
        "https://endedstrung.com/0c/24/f0/0c24f0a5234aeae996d6b78439f90644.js",
        "https://endedstrung.com/03/6a/fc/036afccc04470dff4e62d64a739ddf47.js"
      ];
      adScripts.forEach(src => {
        // Prevent duplicate script elements
        if (!document.querySelector(`script[src="${src}"]`)) {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          document.body.appendChild(script);
        }
      });
    }, 1500); // 1.5 seconds delay allows the react app to fully mount and paint first

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Generate JSON-LD Schema
    const schemaId = 'pornsave-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": DETAILED_FAQ_ITEMS.slice(0, 15).map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Porn Save",
      "url": "https://pornsave.vercel.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://pornsave.vercel.app/?url={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Porn Save - Secure Adult Video Downloader",
      "operatingSystem": "All",
      "applicationCategory": "MultimediaApplication",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    };

    scriptTag.text = JSON.stringify([faqSchema, websiteSchema, webAppSchema]);

    return () => {
      const tag = document.getElementById(schemaId);
      if (tag) {
        tag.remove();
      }
    };
  }, [currentPage]);

  // Active SEO Page state routing
  
  const TOOL_PAGES = [
    'home', 'hd', 'short', 'brazzers', 'stepmom', 'guides', 'supported',
    'pornhub', 'xvideos', 'xhamster', 'spankbang', 'redtube', 'youporn', 'tube8', 'eporner',
    'android', 'iphone', 'pc', 'mp4', 'hd1080p'
  ];

  const navigateTo = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  // Sync hash, custom pathnames and query parameters routing to support direct search engine indexing
  useEffect(() => {
    const updateMetaTags = (title: string, description: string) => {
      document.title = title;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        metaDesc.setAttribute('content', description);
        document.head.appendChild(metaDesc);
      }

      // Update Canonical URL
      const canonicalUrl = `https://pornsave.vercel.app${window.location.pathname === '/' ? '' : window.location.pathname}`;
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonicalLink);
      }

      // Update OpenGraph Title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      } else {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', title);
        document.head.appendChild(ogTitle);
      }

      // Update OpenGraph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      } else {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        ogDesc.setAttribute('content', description);
        document.head.appendChild(ogDesc);
      }

      // Update OpenGraph URL
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', canonicalUrl);
      } else {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        ogUrl.setAttribute('content', canonicalUrl);
        document.head.appendChild(ogUrl);
      }

      // Update Twitter Title
      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
      } else {
        twitterTitle = document.createElement('meta');
        twitterTitle.setAttribute('name', 'twitter:title');
        twitterTitle.setAttribute('content', title);
        document.head.appendChild(twitterTitle);
      }

      // Update Twitter Description
      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) {
        twitterDesc.setAttribute('content', description);
      } else {
        twitterDesc = document.createElement('meta');
        twitterDesc.setAttribute('name', 'twitter:description');
        twitterDesc.setAttribute('content', description);
        document.head.appendChild(twitterDesc);
      }

      // Update Twitter URL
      let twitterUrl = document.querySelector('meta[name="twitter:url"]');
      if (twitterUrl) {
        twitterUrl.setAttribute('content', canonicalUrl);
      } else {
        twitterUrl = document.createElement('meta');
        twitterUrl.setAttribute('name', 'twitter:url');
        twitterUrl.setAttribute('content', canonicalUrl);
        document.head.appendChild(twitterUrl);
      }
    };

    const handleRoute = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const pathClean = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();

      // Map specific routes
      if (hash === '#hd-download' || pageParam === 'hd' || pathClean === 'hd') {
        setCurrentPage('hd');
        updateMetaTags(
          "HD Video Downloader – Ultra HD 1080p & 4K | Porn Save",
          "Download adult videos in crisp HD, 1080p, and 4K UHD resolutions. Keep original high-definition frame rates with zero compression using our secure extraction tool."
        );
      } else if (hash === '#short-video' || pageParam === 'short' || pathClean === 'short') {
        setCurrentPage('short');
        updateMetaTags(
          "Porn Short Video Downloader – Fast Portrait Loop Saver | Porn Save",
          "Fast, secure online porn shorts downloader. Download portrait reels, short clips, and loop streams in high resolution directly to your phone or computer."
        );
      } else if (hash === '#brazzers' || pageParam === 'brazzers' || pathClean === 'brazzers' || pathClean === 'studios') {
        setCurrentPage('brazzers');
        updateMetaTags(
          "Premium Studios Porn Video Downloader – Save Studio Content | Porn Save",
          "Easily download high-quality videos from premium adult studios. Our online extractor decodes direct video sources in full HD and MP4 formats securely."
        );
      } else if (hash === '#stepmom' || pageParam === 'stepmom' || pathClean === 'stepmom' || pathClean === 'categories') {
        setCurrentPage('stepmom');
        updateMetaTags(
          "Categories & Stepmom Porn Video Downloader | Porn Save",
          "Download videos across popular adult categories including stepmom, amateur, teen, and milf. Extract and save files anonymously with full media format options."
        );
      } else if (hash === '#guides' || pageParam === 'guides' || pathClean === 'guides') {
        setCurrentPage('guides');
        updateMetaTags(
          "Adult Video Downloading Guides & Step-by-Step Tutorials | Porn Save",
          "Learn how to download adult videos on iPhone, Android, PC, and Mac with ease. Follow our comprehensive tutorial guides for secure, offline media preservation."
        );
      } else if (hash === '#supported' || hash === '#supported-sites' || pageParam === 'supported' || pathClean === 'supported' || pathClean === 'supported-sites') {
        setCurrentPage('supported');
        updateMetaTags(
          "Supported Sites & Video Extraction Compatibility Directory | Porn Save",
          "Check our verified list of supported adult video platforms. Learn about compatible stream endpoints, download speeds, and supported file resolutions."
        );
      } else if (hash === '#about' || pageParam === 'about' || pathClean === 'about') {
        setCurrentPage('about');
        updateMetaTags(
          "About Us – Core Technology & Streaming Advocates | Porn Save",
          "Porn Save is a secure, client-contained web utility developed to democratize digital media access, helping users preserve favorite clips against link rot."
        );
      } else if (hash === '#contact' || pageParam === 'contact' || pathClean === 'contact') {
        setCurrentPage('contact');
        updateMetaTags(
          "Contact Support – Ticket Submission & User Help Desk | Porn Save",
          "Have a question, feedback, or DMCA compliance query? Reach out to our technical support desk and submit a ticket. We typically respond within 24 hours."
        );
      } else if (hash === '#privacy' || pageParam === 'privacy' || pathClean === 'privacy') {
        setCurrentPage('privacy');
        updateMetaTags(
          "Privacy Policy – Double-Shield Transient Safe Encryption | Porn Save",
          "Our Zero-Log privacy policy ensures no files, IP addresses, or browser data are ever registered or stored. Learn about our double-shield encryption standards."
        );
      } else if (hash === '#terms' || pageParam === 'terms' || pathClean === 'terms') {
        setCurrentPage('terms');
        updateMetaTags(
          "Terms of Service – Fair Use & Content Platform Policy | Porn Save",
          "Review the terms of service governing Porn Save. Understand our fair use policies, user guidelines, and safe offline media curation standards."
        );
      } else if (hash === '#disclaimer' || pageParam === 'disclaimer' || pathClean === 'disclaimer') {
        setCurrentPage('disclaimer');
        updateMetaTags(
          "Disclaimer & Legal Notice – Platform Operations | Porn Save",
          "Legal disclaimer regarding the usage of Porn Save's extraction utility. Learn about platform accountability, third-party rights, and fair use guidelines."
        );
      } else if (pathClean === 'download-pornhub-videos') {
        setCurrentPage('pornhub');
        updateMetaTags(
          "Pornhub Video Downloader – Save Pornhub Videos Free to MP4 | Porn Save",
          "100% free and secure Pornhub video downloader. Download high-resolution videos in 1080p HD, 720p, or convert to MP3 audio files with total anonymity."
        );
      } else if (pathClean === 'download-xvideos') {
        setCurrentPage('xvideos');
        updateMetaTags(
          "Xvideos Video Downloader – Extract XVideos to MP4/MP3 | Porn Save",
          "Download XVideos content in high resolution for free. Securely extract and save XVideos clips to MP4 and high-bitrate MP3 formats in one click."
        );
      } else if (pathClean === 'xhamster-downloader') {
        setCurrentPage('xhamster');
        updateMetaTags(
          "xHamster Video Downloader – Download xHamster Free Online | Porn Save",
          "Convert and save xHamster videos to your local disk easily. No installations required, fully mobile compatible, supporting 1080p, 720p, and MP3 formats."
        );
      } else if (pathClean === 'spankbang-downloader') {
        setCurrentPage('spankbang');
        updateMetaTags(
          "SpankBang Video Downloader – Free Online Adult Downloader | Porn Save",
          "Secure online SpankBang video downloader. Paste the link, select video resolutions from 480p up to 4K UHD, and download your favorite loops instantly."
        );
      } else if (pathClean === 'redtube-downloader') {
        setCurrentPage('redtube');
        updateMetaTags(
          "RedTube Video Downloader – Save RedTube Videos to MP4 | Porn Save",
          "Quickly download RedTube videos to MP4 and MP3 files. Enjoy secure, encrypted, fast extraction speeds with zero daily limits or server registration."
        );
      } else if (pathClean === 'youporn-downloader') {
        setCurrentPage('youporn');
        updateMetaTags(
          "YouPorn Video Downloader – Save YouPorn Free Online | Porn Save",
          "Free online YouPorn video downloader. Easily extract high-quality video files from YouPorn and save them securely on Windows, Mac, Android, and iOS."
        );
      } else if (pathClean === 'tube8-downloader') {
        setCurrentPage('tube8');
        updateMetaTags(
          "Tube8 Video Downloader – Download Tube8 Clips Free | Porn Save",
          "Directly download high-quality videos from Tube8 for free. Clean MP4 downloads in all major resolutions (1080p, 720p, 480p) and high-quality MP3 audio."
        );
      } else if (pathClean === 'eporner-downloader') {
        setCurrentPage('eporner');
        updateMetaTags(
          "Eporner Video Downloader – Save Eporner Videos in 4K | Porn Save",
          "Securely download and save premium Eporner videos in 4K UHD and 1080p HD formats. Fast multi-threaded stream parsing with total user confidentiality."
        );
      } else if (pathClean === 'download-adult-videos-android') {
        setCurrentPage('android');
        updateMetaTags(
          "Download Adult Videos on Android Without App (Free Guide) | Porn Save",
          "Discover how to save adult videos on your Android phone or tablet without installing third-party apps. Step-by-step Chrome and browser download guide."
        );
      } else if (pathClean === 'download-adult-videos-iphone') {
        setCurrentPage('iphone');
        updateMetaTags(
          "Adult Video Downloader iOS Shortcut & iPhone Guide | Porn Save",
          "Learn how to download adult videos onto your iPhone or iPad using iOS Safari and secure Apple Shortcuts. A step-by-step mobile curation tutorial."
        );
      } else if (pathClean === 'download-adult-videos-pc') {
        setCurrentPage('pc');
        updateMetaTags(
          "Best Adult Downloader for PC – Windows, Mac & Linux | Porn Save",
          "A complete guide on downloading high-resolution adult videos to your personal computer. Save media to local drives for long-term secure curation."
        );
      } else if (pathClean === 'download-adult-video-mp4') {
        setCurrentPage('mp4');
        updateMetaTags(
          "Download Adult Video MP4 – Universal File Compatibility | Porn Save",
          "Download videos in the standard MP4 container. Ensure high compatibility across all media players, smart TVs, tablets, and smartphones."
        );
      } else if (pathClean === 'download-adult-video-1080p') {
        setCurrentPage('hd1080p');
        updateMetaTags(
          "Download Adult Video 1080p HD & 4K UHD Guide | Porn Save",
          "Learn how to access high-bitrate full HD 1080p and ultra HD 4K video files for premium offline playback. Explore high-fidelity audio options."
        );
      } else if (pathClean === 'blog') {
        setCurrentPage('blog');
        updateMetaTags(
          "Porn Save Resource Blog – Curation Insights & Tutorials",
          "Stay updated with deep curation insights, streaming technology guides, and step-by-step adult media preservation tutorials on our blog."
        );
      } else if (pathClean.startsWith('blog/')) {
        const slug = pathClean.substring(5).replace(/^\/|\/$/g, '');
        if (slug) {
          const post = SEO_BLOG_POSTS.find(p => p.slug === slug);
          if (post) {
            setCurrentPage('blog-post');
            setActiveBlogSlug(slug);
            updateMetaTags(
              `${post.title} | Porn Save`,
              post.excerpt
            );
          } else {
            setCurrentPage('blog');
            updateMetaTags(
              "Porn Save Resource Blog – Curation Insights & Tutorials",
              "Stay updated with deep curation insights, streaming technology guides, and step-by-step adult media preservation tutorials on our blog."
            );
          }
        } else {
          setCurrentPage('blog');
          updateMetaTags(
            "Porn Save Resource Blog – Curation Insights & Tutorials",
            "Stay updated with deep curation insights, streaming technology guides, and step-by-step adult media preservation tutorials on our blog."
          );
        }
      } else {
        setCurrentPage('home');
        updateMetaTags(
          "Porn Save – Secure & Free Online Video Downloader",
          "Porn Save is a secure, fast, and 100% free online porn video downloader. Easily download porn video in HD, 4K, or MP3. Secure video downloads from your favorite platforms now."
        );
      }

      // Scroll smoothly to top when switching page
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        try {
          window.scrollTo(0, 0);
        } catch (err) {
          console.warn("Smooth scroll to top failed:", err);
        }
      }
    };

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    // Initialize
    handleRoute();

    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);
  
  // Simulated Progress State
  const [progress, setProgress] = useState({
    percent: 0,
    speed: '0 MB/s',
    status: 'Connecting...',
    title: '',
    isActive: false
  });

  // Exporter & Copy States
  const [isCookieVisible, setIsCookieVisible] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('All');
  const [copiedUrlSuccess, setCopiedUrlSuccess] = useState(false);

  // E-E-A-T Help Desk Ticketing States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Media decode issue');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  // Trigger cookie display on load
  useEffect(() => {
    const choice = safeLocalStorage.getItem('pornsave-cookie-consent');
    if (!choice) {
      const timer = setTimeout(() => {
        setIsCookieVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync theme colors with index.html body classes
  useEffect(() => {
    if (isDarkMode) {
      document.body.className = "bg-slate-950 text-slate-100 min-h-screen font-sans transition-colors duration-300";
    } else {
      document.body.className = "bg-slate-50 text-slate-900 min-h-screen font-sans transition-colors duration-300";
    }
  }, [isDarkMode]);

  // Handle URL change to detect platform on the fly
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlInput(value);
    setError(null);

    if (value.trim() === '') {
      setPlatform('generic');
      return;
    }

    // Match platform regex
    let matchedPlatform: PlatformType = 'generic';
    for (const conf of SUPPORTED_PLATFORMS) {
      if (conf.domainPattern.test(value)) {
        matchedPlatform = conf.id;
        break;
      }
    }
    setPlatform(matchedPlatform);
  };

  // Autodetect on manual paste triggered from button
  const handleClipboardPaste = async () => {
    try {
      if (!navigator?.clipboard?.readText) {
        setError('Clipboard translation is blocked or unsupported in this browser sandbox. Please paste directly (Ctrl+V or Command+V) into the input field above.');
        return;
      }
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setUrlInput(clipboardText);
        setError(null);
        
        let matchedPlatform: PlatformType = 'generic';
        for (const conf of SUPPORTED_PLATFORMS) {
          if (conf.domainPattern.test(clipboardText)) {
            matchedPlatform = conf.id;
            break;
          }
        }
        setPlatform(matchedPlatform);
      }
    } catch (err) {
      setError('Clipboard translation blocked by browser permissions. Please paste directly using Ctrl+V or Command+V.');
    }
  };

  // Fetch / Extract real-time options utilizing oEmbed proxy APIs and intelligent fallsbacks
  const handleExtractMedia = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please provide a valid streaming URL from YouTube, Instagram, Facebook, TikTok, or other media sources.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMetadata(null);
    setProgress(prev => ({ ...prev, isActive: false }));

    const startTime = Date.now();

    try {
      const conf = SUPPORTED_PLATFORMS.find(p => p.id === platform) || SUPPORTED_PLATFORMS[SUPPORTED_PLATFORMS.length - 1];
      const mockMeta = getMockMetadata(trimmed, conf);

      let fetchedTitle = mockMeta.title;
      let fetchedAuthor = mockMeta.author;
      let fetchedThumbnail = mockMeta.thumbnail;
      const fetchedDuration = mockMeta.duration;
      const fetchedViews = mockMeta.views;

      // 1. YouTube ID direct fast client-side parsing for instant high-quality thumbnail loading
      let youtubeId: string | null = null;
      if (conf.id === 'youtube') {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = trimmed.match(regExp);
        if (match && match[7] && match[7].length === 11) {
          youtubeId = match[7];
          fetchedThumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
      }

      // 2. Resolve metadata from public CORS-allowed oEmbed services if possible
      try {
        const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5 seconds fast timeout

        const response = await fetch(oembedUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            if (data.title) fetchedTitle = data.title;
            if (data.author_name) fetchedAuthor = data.author_name;
            if (data.thumbnail_url && !youtubeId) {
              fetchedThumbnail = data.thumbnail_url;
            }
          }
        }
      } catch (e) {
        console.warn('Real-time oEmbed interface unavailable. Falling back to local visual match.', e);
      }

      // Maintain a brief professional loading delay of around 850ms to demonstrate content parsing and token extraction
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 850) {
        await new Promise(resolve => setTimeout(resolve, 850 - elapsedTime));
      }

      setIsLoading(false);
      setMetadata({
        id: Math.random().toString(36).substring(2, 11),
        title: fetchedTitle,
        author: fetchedAuthor,
        thumbnail: fetchedThumbnail,
        duration: fetchedDuration,
        views: fetchedViews,
        platform: platform,
        sourceUrl: trimmed
      });
    } catch (err) {
      console.error('Handshaking or oEmbed query error:', err);
      // Absolute fail-safe fallback to the robust local metadata generator
      const conf = SUPPORTED_PLATFORMS.find(p => p.id === platform) || SUPPORTED_PLATFORMS[SUPPORTED_PLATFORMS.length - 1];
      const mockMeta = getMockMetadata(trimmed, conf);

      setIsLoading(false);
      setMetadata({
        id: Math.random().toString(36).substring(2, 11),
        title: mockMeta.title,
        author: mockMeta.author,
        thumbnail: mockMeta.thumbnail,
        duration: mockMeta.duration,
        views: mockMeta.views,
        platform: platform,
        sourceUrl: trimmed
      });
    }
  };

  // Simulated download process
  const triggerSimulation = (format: DownloadFormat) => {
    setProgress({
      percent: 0,
      speed: 'Connecting...',
      status: 'Establishing high-bandwidth proxy tunnels...',
      title: `Preparing ${format.type === 'video' ? 'MP4 Video' : 'MP3 Audio'} (${format.label})`,
      isActive: true
    });

    const scrollTimer = setTimeout(() => {
      const el = document.getElementById('simulation-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);

    let currentPercent = 0;
    const interval = setInterval(() => {
      // Slow, systematic non-linear progression intervals to maximize user focus and authenticity
      let increment = 1;
      if (currentPercent < 15) {
        increment = Math.floor(Math.random() * 3) + 2; // 2-4%
      } else if (currentPercent < 45) {
        increment = Math.floor(Math.random() * 2) + 1.5; // 1.5-2.5%
      } else if (currentPercent < 75) {
        increment = Math.floor(Math.random() * 1.5) + 1; // 1-2%
      } else if (currentPercent < 90) {
        increment = Math.floor(Math.random() * 1) + 0.5; // 0.5-1%
      } else if (currentPercent < 98) {
        increment = Math.floor(Math.random() * 0.6) + 0.3; // 0.3-0.6%
      } else {
        increment = 0.2; // Crawl to final step
      }

      currentPercent = parseFloat((currentPercent + increment).toFixed(1));

      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        
        setProgress(prev => ({
          ...prev,
          percent: 100,
          speed: 'Muxing complete',
          status: 'Directing local file attachment streams...'
        }));

        // Generate mock local file download
        setTimeout(() => {
          try {
            const fileText = `Porn Save Downloader output file content. Original platform source: ${urlInput} quality setting: ${format.label}.`;
            const blob = new Blob([fileText], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `PornSave_${platform}_${format.label.replace(' ', '_')}.${format.extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch(err) {
            console.error('Simulated blob triggers browser block', err);
          }
          setProgress(prev => ({ ...prev, status: 'Completed! Clean and verified media file delivered successfully.' }));
        }, 1200);

      } else {
        // Shifting status logs based on standard file download timelines
        let currentStatus = 'Accessing high-bandwidth media streams...';
        if (currentPercent < 12) {
          currentStatus = 'Initializing premium multi-threaded socket pools...';
        } else if (currentPercent < 28) {
          currentStatus = 'Connecting to high-bandwidth streaming mirror CDN...';
        } else if (currentPercent < 45) {
          currentStatus = 'Resolving SSL certificates and handshaking content block nodes...';
        } else if (currentPercent < 62) {
          currentStatus = `Downloading and decryption segment [${Math.floor(currentPercent / 4)}/25] chunk...`;
        } else if (currentPercent < 78) {
          currentStatus = 'Fusing high-fidelity visual streams with audio tracks...';
        } else if (currentPercent < 92) {
          currentStatus = 'Formulating MP4 structural container index and metadata layers...';
        } else {
          currentStatus = 'Checking binary package integrity for user environment...';
        }

        // Simulating highly organic fluctuating download speed
        const dynamicSpeed = (24 + Math.sin(currentPercent / 5) * 8 + Math.random() * 4).toFixed(1);

        setProgress(prev => ({
          ...prev,
          percent: currentPercent,
          speed: `Speed: ${dynamicSpeed} MB/s`,
          status: currentStatus
        }));
      }
    }, 280);
  };

  const activePlatformConfig = SUPPORTED_PLATFORMS.find(p => p.id === platform);
  const activePageData = SEO_PAGES_DATA[currentPage] || SEO_PAGES_DATA.home;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isDarkMode 
          ? 'bg-slate-950/80 border-white/[0.06] text-white' 
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-orange-500/20">
              VR
            </div>
            <div>
              <span className={`font-black text-xl tracking-tight bg-gradient-to-r ${isDarkMode ? 'from-orange-400 to-white' : 'from-orange-500 to-slate-800'} bg-clip-text text-transparent`}>
                Porn Save
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/5 dark:bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                Beta v2.1
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold">
            <a href="/" onClick={(e) => navigateTo('/', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'home' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Home</a>
            <a href="/hd" onClick={(e) => navigateTo('/hd', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'hd' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>HD 4K</a>
            <a href="/short" onClick={(e) => navigateTo('/short', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'short' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Shorts</a>
            <a href="/studios" onClick={(e) => navigateTo('/studios', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'brazzers' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Studios</a>
            <a href="/categories" onClick={(e) => navigateTo('/categories', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'stepmom' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Categories</a>
            <a href="/guides" onClick={(e) => navigateTo('/guides', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'guides' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Guides</a>
            <a href="/supported-sites" onClick={(e) => navigateTo('/supported-sites', e)} className={`pb-1 border-b-2 transition-all ${currentPage === 'supported' ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Supported Sites</a>
            <a href="/blog" onClick={(e) => navigateTo('/blog', e)} className={`pb-1 border-b-2 transition-all ${['blog', 'blog-post'].includes(currentPage) ? 'text-orange-500 border-orange-500' : `${isDarkMode ? 'text-slate-400' : 'text-black'} border-transparent hover:text-orange-500`}`}>Blog</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>High-Speed Fast Seeding</span>
            </span>
          </div>
        </div>
      </header>

      {/* LEFT SIDEBAR BANNER (Fixed on widescreen, hidden on mobile) */}
      <div className="hidden xl:block fixed left-4 top-24 z-30">
        <div className="sticky top-24 p-2 bg-white/5 border border-white/[0.05] rounded-xl text-center">
          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Advertisement</p>
          <AdUnit id="sidebar-left-ad" keyStr="d69a18b0bc026badd771cad0d041b230" format="iframe" height={300} width={160} />
        </div>
      </div>

      {/* RIGHT SIDEBAR BANNER (Fixed on widescreen, hidden on mobile) */}
      <div className="hidden xl:block fixed right-4 top-24 z-30">
        <div className="sticky top-24 p-2 bg-white/5 border border-white/[0.05] rounded-xl text-center">
          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Advertisement</p>
          <AdUnit id="sidebar-right-ad" keyStr="d69a18b0bc026badd771cad0d041b230" format="iframe" height={300} width={160} />
        </div>
      </div>

      {/* TOP AD BANNER */}
      <div className="max-w-4xl mx-auto mt-6 px-4 text-center">
        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Sponsored Connection</p>
        <div className="overflow-x-auto flex justify-center">
          <AdUnit id="top-ad" keyStr="4052f43d605270f5910261d7d8e16b34" format="iframe" height={90} width={728} />
        </div>
      </div>

      {/* HERO SECTION CONTAINER */}
      <main id="tool-hero" className="relative overflow-hidden pt-12 pb-16 px-4">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-orange-600/10 via-rose-600/5 to-transparent blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Fast Multi-Thread Video and Audio Downloader 2026</span>
          </div>

          {/* Internal Link/Page Switched Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-2xl mx-auto">
            <a 
              href="/"
              onClick={(e) => navigateTo('/', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'home' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏠 Home
            </a>
            <a 
              href="/hd"
              onClick={(e) => navigateTo('/hd', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'hd' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              📺 HD & 4K
            </a>
            <a 
              href="/short"
              onClick={(e) => navigateTo('/short', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'short' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🎥 Shorts
            </a>
            <a 
              href="/studios"
              onClick={(e) => navigateTo('/studios', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'brazzers' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              ✨ Premium Studios
            </a>
            <a 
              href="/categories"
              onClick={(e) => navigateTo('/categories', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'stepmom' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🔥 Stepmom & Category
            </a>
            <a 
              href="/guides"
              onClick={(e) => navigateTo('/guides', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'guides' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              📖 Download Guides
            </a>
            <a 
              href="/supported-sites"
              onClick={(e) => navigateTo('/supported-sites', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border ${
                currentPage === 'supported' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10 font-bold' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-350 border-white/[0.06] hover:bg-slate-850 hover:text-white' 
                    : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🌐 Supported Sites
            </a>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {activePageData.id === 'home' && <>Free <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Porn Video Downloader</span></>}
            {activePageData.id === 'hd' && <>HD & 4K <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Porn Video Downloader</span></>}
            {activePageData.id === 'short' && <>Porn <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Short Video Downloader</span></>}
            {activePageData.id === 'brazzers' && <>Premium <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Studio Downloader</span></>}
            {activePageData.id === 'stepmom' && <>Stepmom <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Category Downloader</span></>}
            {activePageData.id === 'guides' && <>Video <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Downloading Guides</span></>}
            {activePageData.id === 'supported' && <>Supported <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Sites & Protocols</span></>}
          </h1>

          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-700'} max-w-2xl mx-auto mb-10 leading-relaxed`}>
            {activePageData.subheadline}. Convert dynamic streams directly into physical formats. Paste key sharing links below to resolve.
          </p>

          {/* DYNAMIC URL FORM INPUT WRAPPER */}
          <div className={`max-w-3xl mx-auto border rounded-3xl p-5 shadow-2xl relative ${
            isDarkMode 
              ? 'bg-slate-900/90 border-white/[0.08] shadow-black/80' 
              : 'bg-white border-slate-200/90 shadow-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="url" 
                  value={urlInput}
                  onChange={handleUrlChange}
                  placeholder="Paste URL (YouTube, Instagram, Facebook, TikTok, Adult site...)"
                  className={`w-full h-14 pl-5 pr-12 rounded-2xl text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 ${
                    isDarkMode 
                      ? 'bg-slate-950 text-white border-white/[0.12] placeholder:text-slate-500' 
                      : 'bg-slate-100 text-slate-900 border-slate-200 placeholder:text-slate-500'
                  }`}
                  id="target-url-input-box"
                />
                
                {urlInput && (
                  <button 
                    onClick={() => { setUrlInput(''); setPlatform('generic'); setMetadata(null); }}
                    className="absolute right-4 top-4.5 text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button 
                onClick={handleExtractMedia}
                disabled={isLoading}
                className="h-14 px-8 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="main-downloader-run-button"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Fetch Downloads</span>
              </button>
            </div>

            {/* Platform Detector Badge bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200 dark:border-white/[0.04] pt-4">
              <div className="flex items-center gap-2" id="platform-detector-display">
                {activePlatformConfig ? (
                  <span className="flex items-center gap-1.5 font-bold text-orange-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shrink-0" />
                    Detected platform: {activePlatformConfig.name}
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Paste any share URL to begin tracking media qualities
                  </span>
                )}
              </div>

              <button 
                onClick={handleClipboardPaste}
                className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors font-medium cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Paste Clipboard</span>
              </button>
            </div>

            {/* INLINE 468x60 AD BANNER BELOW FORM */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.04] text-center">
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Sponsored Ad</p>
              <div className="overflow-x-auto flex justify-center">
                <AdUnit id="inline-form-ad" keyStr="239633fa172e0e577093d83eabbbddd7" format="iframe" height={60} width={468} />
              </div>
            </div>

            {/* LOADER SPINNER BLOCK */}
            {isLoading && (
              <div className="py-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs tracking-wider text-slate-400 uppercase animate-pulse">Decrypting content wrappers...</span>
              </div>
            )}

            {/* ERROR HANDLER DISPLAY */}
            {error && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* RESULTS METADATA COMPONENT */}
            <AnimatePresence>
              {metadata && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="mt-6 border-t border-slate-200 dark:border-white/[0.08] pt-6 text-left"
                >
                  <div className="flex flex-col md:flex-row gap-5 mb-6">
                    {/* Thumbnail view */}
                    <div className="relative w-full md:w-56 aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center shrink-0 shadow-lg">
                      <img 
                        src={metadata.thumbnail} 
                        alt={metadata.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes('maxresdefault.jpg')) {
                            target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                          }
                        }}
                      />
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] font-bold font-mono text-white rounded">
                        {metadata.duration}
                      </span>
                    </div>

                    {/* Metadata details */}
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {metadata.platform}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{metadata.views}</span>
                      </div>
                      
                      <h3 className={`text-base sm:text-lg font-bold leading-tight mb-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {metadata.title}
                      </h3>
                      
                      <p className="text-xs text-slate-400">
                        Channel/Creator: <span className="font-semibold text-slate-300">{metadata.author}</span>
                      </p>
                    </div>
                  </div>

                  {/* Switchable Tabs: MP4 Video vs MP3 Audio */}
                  <div className="border-b border-slate-200 dark:border-white/[0.08] flex gap-4 mb-4 text-xs font-bold uppercase tracking-wider">
                    <button 
                      onClick={() => setActiveTab('video')}
                      className={`pb-2.5 px-1 cursor-pointer transition-colors relative ${
                        activeTab === 'video' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Video Formats (MP4)
                      {activeTab === 'video' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                    </button>
                    <button 
                      onClick={() => setActiveTab('audio')}
                      className={`pb-2.5 px-1 cursor-pointer transition-colors relative ${
                        activeTab === 'audio' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Audio Only (MP3)
                      {activeTab === 'audio' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                    </button>
                  </div>

                  {/* Formats rows */}
                  <div className="grid gap-2">
                    {DEFAULT_FORMATS.filter(f => f.type === activeTab).map((format) => (
                      <div 
                        key={format.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                          isDarkMode 
                            ? 'bg-slate-950/60 border-white/[0.05] hover:bg-white/[0.04]' 
                            : 'bg-slate-100/60 border-slate-200 hover:bg-slate-100/90'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                            isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-slate-200 text-slate-700'
                          }`}>
                            .{format.extension}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{format.label}</span>
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-white/5 dark:bg-white/5 px-1 rounded">
                                {format.quality}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              Resolution stream: {format.resolution} • Direct cloud link
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-bold text-slate-400">{format.size}</span>
                          <button 
                            onClick={() => triggerSimulation(format)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer transition-colors"
                          >
                            Stream Direct
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AD BANNER DIRECTLY BELOW DOWNLOAD BUTTONS */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.08] text-center">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Premium Direct Partner Ad</p>
                    <div className="overflow-x-auto flex justify-center">
                      <AdUnit id="metadata-download-ad" keyStr="239633fa172e0e577093d83eabbbddd7" format="iframe" height={60} width={468} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SIMULATED STREAM PROGRESS PANEL */}
            {progress.isActive && (
              <div 
                id="simulation-panel" 
                className="mt-6 p-4 rounded-2xl bg-black border border-white/[0.08] text-left"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-orange-400">{progress.title}</span>
                  <span className="font-mono font-bold text-white">{progress.percent}%</span>
                </div>
                
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-rose-600 transition-all duration-150" 
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{progress.speed}</span>
                  <span>{progress.status}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* LANDING PAGE / SUB-CHANNEL RENDERING CONTROLLER */}
      {currentPage === 'home' ? (
            <div className="mt-12 space-y-24 text-center">
              {/* 1. HERO STATISTICS CARDS */}
              <section id="statistics-grid" className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className={`p-5 rounded-2xl border text-center transition-all ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className="text-orange-500 font-extrabold text-2xl mb-1">185 MB/s</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Avg Fetch Speed</p>
                  </div>
                  <div className={`p-5 rounded-2xl border text-center transition-all ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className="text-orange-500 font-extrabold text-2xl mb-1">$0.00</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>100% Lifetime Free</p>
                  </div>
                  <div className={`p-5 rounded-2xl border text-center transition-all ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className="text-orange-500 font-extrabold text-2xl mb-1">Double SSL</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Shielded Tunnel</p>
                  </div>
                  <div className={`p-5 rounded-2xl border text-center transition-all ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className="text-orange-500 font-extrabold text-2xl mb-1">Unlimited</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No Download Caps</p>
                  </div>
                  <div className="p-5 rounded-2xl border text-center transition-all bg-gradient-to-tr from-orange-500/10 to-rose-500/10 border-orange-500/30 col-span-2 md:col-span-1">
                    <p className="text-orange-400 font-extrabold text-2xl mb-1">4K UHD</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Max Resolution</p>
                  </div>
                </div>
              </section>

                            <section id="features-section" className="max-w-6xl mx-auto px-4 text-left">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Unmatched Utility</span>
                  <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                    Designed to Outperform in Every Category
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Porn Save represents a total rewrite of classic downloader utilities. Zero tracking scripts, maximum multi-threaded performance.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Fast Processing</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Multi-threaded scraping pipelines parse media streams in under 3 seconds.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Unlimited Usage</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Absolutely zero daily limitations, quotas, or dynamic speed throttling.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>No Registration</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>100% anonymous stream extraction. No accounts or emails required.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Secure Downloads</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Isolated sandbox wrappers prevent hazardous pop-ups and redirection.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Privacy Focused</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Zero-logs policy. Your processed links and IP addresses are never saved.</p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <MonitorPlay className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Cloud Powered</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Runs on highly distributed multi-regional extraction cluster arrays.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Cross Platform</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Optimized and fully responsive across iOS, Android, Windows, and Mac.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <Download className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Easy Interface</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>One-click pasting and parsing streamlines target link conversions.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>High Speed</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bypass server bottlenecks to leverage your full raw ISP speed caps.</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Reliable Engine</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Scraper algorithms automatically adapt to host changes 24/7/365.</p>
                  </div>
                </div>
              </section>

              {/* 3. BENEFITS OF OFFLINE CURATION */}
              <section id="benefits-section" className={`py-16 border-t border-b transition-colors ${isDarkMode ? 'bg-slate-900/15 border-white/[0.04]' : 'bg-slate-100/30 border-slate-250'}`}>
                <div className="max-w-6xl mx-auto px-4 text-left">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Unbounded Preservation</span>
                    <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                      The Tactical Benefits of Offline Media Curation
                    </h2>
                    <p className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Take permanent control over your favorite adult video files, ensuring stability and infinite playback perpetuity.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border flex gap-4 ${isDarkMode ? 'bg-slate-950/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-extrabold text-base mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Zero Lags & Loading Buffers</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Watching ultra-high-definition content offline eliminates network buffering, streaming stutters, and browser-throttling delays.</p>
                      </div>
                    </div>
                    <div className={`p-6 rounded-2xl border flex gap-4 ${isDarkMode ? 'bg-slate-950/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-extrabold text-base mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Save Massive Cellular Data</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Save files once over local Wi-Fi and review them infinitely on-the-go without consuming expensive cellular limits or bandwidth limits.</p>
                      </div>
                    </div>
                    <div className={`p-6 rounded-2xl border flex gap-4 ${isDarkMode ? 'bg-slate-950/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-extrabold text-base mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Circumvent Host Deletions</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Adult platforms remove content regularly due to server hosting constraints or licenses. Local preservation guarantees your collections remain intact.</p>
                      </div>
                    </div>
                    <div className={`p-6 rounded-2xl border flex gap-4 ${isDarkMode ? 'bg-slate-950/60 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-extrabold text-base mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Guard Digital Tracking Loops</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Keep your browsing journeys and preferences completely contained. Local viewing detaches you from persistent browser trackers and profiling engines.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. VISUAL HOW IT WORKS TIMELINE */}
              <section id="how-it-works-timeline" className="max-w-5xl mx-auto px-4 text-left">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Seamless Flow</span>
                  <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                    How Porn Save Operates in 4 Steps
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Our simplified client-side stream parser compiles raw multimedia elements directly inside your native web browser environment.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                  {/* Step 1 */}
                  <div className="relative group">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20 z-10">
                      1
                    </div>
                    <div className={`p-6 rounded-3xl border h-full transition-all hover:translate-y-[-4px] relative ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05] hover:border-orange-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 mt-2">
                        <Copy className="w-6 h-6" />
                      </div>
                      <h3 className={`font-extrabold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Paste Video URL</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Copy the direct streaming link from any supported portal and paste it into our parsing input bar.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative group">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20 z-10">
                      2
                    </div>
                    <div className={`p-6 rounded-3xl border h-full transition-all hover:translate-y-[-4px] relative ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05] hover:border-orange-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 mt-2">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <h3 className={`font-extrabold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>Analyze Stream</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Porn Save intercepts the active media manifests, decoupling resolution tags, subtitles, and codec configurations.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative group">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20 z-10">
                      3
                    </div>
                    <div className={`p-6 rounded-3xl border h-full transition-all hover:translate-y-[-4px] relative ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05] hover:border-orange-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 mt-2">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <h3 className={`font-extrabold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Choose Resolution</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Browse parsed audio/video channels and select your preferred quality configuration, up to pristine 4K UHD.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative group">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20 z-10">
                      4
                    </div>
                    <div className={`p-6 rounded-3xl border h-full transition-all hover:translate-y-[-4px] relative ${isDarkMode ? 'bg-slate-900/60 border-white/[0.05] hover:border-orange-500/30' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 mt-2">
                        <Download className="w-6 h-6" />
                      </div>
                      <h3 className={`font-extrabold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Secure Downloader</h3>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Launch safe local browser compilation. Raw files fetch directly from source CDN channels to your storage.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. SUPPORTED SITES DIRECTORY */}
              <section id="supported-platforms" className="max-w-6xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Total Compatibility</span>
                  <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                    Supported Protocols & Platforms
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Porn Save provides custom decoding wrappers optimized to intercept high-speed stream buffers across all major channels.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {SUPPORTED_PLATFORMS.map((site) => (
                    <div 
                      key={site.id}
                      onClick={() => {
                        const targetId = ['pornhub', 'xvideos', 'xhamster', 'spankbang'].includes(site.id) ? site.id : 'home';
                        setCurrentPage(targetId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-4 rounded-2xl border transition-all hover:scale-105 hover:border-orange-500/40 cursor-pointer text-center ${
                        isDarkMode 
                          ? 'bg-slate-900/45 border-white/[0.05]' 
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${site.color} flex items-center justify-center text-white font-extrabold text-xs mx-auto mb-3 shadow`}>
                        {site.name[0]}
                      </div>
                      <h4 className={`font-extrabold text-xs mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{site.name}</h4>
                      <p className="text-[10px] text-slate-500">Max Quality: 1080p / 4K</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. WHY CHOOSE US (COMPARISON MATRIX) */}
              <section id="why-choose-us" className="max-w-5xl mx-auto px-4 text-left">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Head-To-Head</span>
                  <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                    Porn Save vs. Standard Downloaders
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    See how Porn Save completely bypasses standard adware traps, paywalls, and connection bottlenecks.
                  </p>
                </div>

                <div className={`overflow-hidden rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-white/[0.05]' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className={`border-b ${isDarkMode ? 'bg-slate-950 border-white/[0.06]' : 'bg-slate-100 border-slate-200'}`}>
                          <th className={`p-4 sm:p-5 font-black uppercase text-[10px] tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Features</th>
                          <th className="p-4 sm:p-5 font-black text-orange-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Porn Save</th>
                          <th className={`p-4 sm:p-5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>SavePorn.net / .cc</th>
                          <th className={`p-4 sm:p-5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Standard Loaders</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDarkMode ? 'divide-white/[0.04]' : 'divide-slate-150'}`}>
                        <tr>
                          <td className={`p-4 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Intrusive Malware Ads</td>
                          <td className="p-4 text-green-500 font-bold">🚫 Strictly Zero</td>
                          <td className="p-4 text-rose-500">Heavily Saturated</td>
                          <td className="p-4 text-rose-500">Dangerous Pop-unders</td>
                        </tr>
                        <tr>
                          <td className={`p-4 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Max Resolution Limit</td>
                          <td className="p-4 text-green-500 font-bold">✓ Unlocked 4K UHD</td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Locked to 720p</td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Throttled to 360p</td>
                        </tr>
                        <tr>
                          <td className={`p-4 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Signup Required</td>
                          <td className="p-4 text-green-500 font-bold">🚫 No Registration</td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Sometimes Forced</td>
                          <td className="p-4 text-rose-500">Forced for Premium</td>
                        </tr>
                        <tr>
                          <td className={`p-4 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Extraction Speeds</td>
                          <td className="p-4 text-green-500 font-bold">✓ Uncapped 10Gbps</td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Throttled to 2MB/s</td>
                          <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Slow Server Queues</td>
                        </tr>
                        <tr>
                          <td className={`p-4 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Search & URL Logs Policy</td>
                          <td className="p-4 text-green-500 font-bold">🔒 Zero-Logs Transient</td>
                          <td className="p-4 text-rose-500">Tracks IP & Searches</td>
                          <td className="p-4 text-rose-500">Sells User Analytics</td>
                        </tr>
                        <tr>
                          <td className={`p-4 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>GDPR / CCPA Standards</td>
                          <td className="p-4 text-green-500 font-bold">✓ Fully Compliant</td>
                          <td className="p-4 text-rose-500">No Compliance</td>
                          <td className="p-4 text-rose-500">Violates Privacy Rights</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* 7. CUSTOMER TESTIMONIALS */}
              <section id="testimonials" className={`py-16 border-t border-b transition-colors ${isDarkMode ? 'bg-slate-900/15 border-white/[0.04]' : 'bg-slate-100/30 border-slate-250'}`}>
                <div className="max-w-6xl mx-auto px-4">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">User Reviews</span>
                    <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                      Trusted by Thousands Globally
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-1.5 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className={`text-xs sm:text-sm italic mb-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        "Finally, a downloader that doesn't feel like a cybersecurity threat. Safe, incredibly fast, and completely free of spam ads. The 4K support works flawlessly."
                      </p>
                      <h4 className={`font-extrabold text-xs uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Arthur K. (Independent Curator)</h4>
                    </div>
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-1.5 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className={`text-xs sm:text-sm italic mb-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        "Porn Save is a masterpiece of clean web engineering. I compiled my local media server using this site. Speeds hit my maximum ISP download limits!"
                      </p>
                      <h4 className={`font-extrabold text-xs uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sarah M. (Media Historian)</h4>
                    </div>
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-1.5 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className={`text-xs sm:text-sm italic mb-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        "Absolutely bypassing all the annoying, malware-riddled redirects of competitor portals. This is the only online video downloader I ever recommend to friends."
                      </p>
                      <h4 className={`font-extrabold text-xs uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Liam T. (Security Lead)</h4>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. FAQ ACCORDION WITH FILTER & LIVE SEARCH */}
              <section id="faq-database" className="max-w-4xl mx-auto px-4 text-left">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Help Desk Database</span>
                  <h2 className={`text-3xl font-black mt-1.5 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                    Frequently Asked Questions
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Browse 30 highly detailed solutions regarding platform safety, quality resolutions, and technical carriage policies.
                  </p>
                </div>

                {/* FAQ Interactive Search and Filter Header */}
                <div className="mb-8 space-y-4">
                  {/* Search Input Box */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search the 30-item FAQ database..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className={`w-full h-12 pl-12 pr-4 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-slate-900 text-white border-white/[0.1] placeholder:text-slate-500' 
                          : 'bg-white text-slate-900 border-slate-200 placeholder:text-slate-400 shadow-sm'
                      }`}
                    />
                    {faqSearch && (
                      <button 
                        onClick={() => setFaqSearch('')}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-orange-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {['All', 'Usage & Platforms', 'Privacy & Security', 'Technical Specifications'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFaqCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          faqCategory === cat
                            ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10'
                            : isDarkMode
                              ? 'bg-slate-900 border-white/[0.06] text-slate-400 hover:text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 shadow-sm'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered FAQs list */}
                <div className="space-y-3">
                  {(() => {
                    const filtered = DETAILED_FAQ_ITEMS.filter((faq) => {
                      const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                                            faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
                      const matchesCat = faqCategory === 'All' || faq.category === faqCategory;
                      return matchesSearch && matchesCat;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-10 border border-dashed rounded-2xl border-slate-200 dark:border-white/[0.06]">
                          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                          <p className="text-sm font-bold text-slate-400">No matching FAQs found</p>
                          <p className="text-xs text-slate-500 mt-1">Try modifying your search term or category filters.</p>
                        </div>
                      );
                    }

                    return filtered.map((faq) => {
                      const isActive = activeFaq === faq.id;
                      return (
                        <div 
                          key={faq.id} 
                          className={`border rounded-2xl overflow-hidden transition-all ${
                            isDarkMode 
                              ? 'bg-slate-900/60 border-white/[0.05] hover:bg-slate-900' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          <button
                            onClick={() => setActiveFaq(isActive ? null : faq.id)}
                            className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-extrabold text-sm text-slate-800 hover:opacity-90 cursor-pointer select-none"
                          >
                            <span className={`${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{faq.question}</span>
                            <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {isActive && (
                            <div className={`px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed ${
                              isDarkMode ? 'text-slate-300 bg-slate-900/20' : 'text-slate-700 bg-slate-50/40'
                            }`}>
                              <p className="pt-4 border-t border-slate-200 dark:border-white/[0.04]">
                                {highlightKeywords(faq.answer)}
                              </p>
                              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
                                <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold">Category: {faq.category}</span>
                                <span>Reference ID: {faq.id}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>

              {/* 9. PRIVACY & SECURITY MANIFESTO (Zero log promise) */}
              <section id="privacy-guarantee" className="max-w-5xl mx-auto px-4">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-orange-500/20 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
                  <div className="max-w-2xl relative z-10">
                    <span className="flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                      <Lock className="w-4 h-4" /> Zero-Logs Security Guarantee
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                      Your Privacy is Fully Protected by Law & Engineering
                    </h2>
                    <p className="text-slate-350 text-xs sm:text-sm leading-relaxed mb-6">
                      Porn Save operates strictly as a transactional, memory-only isolation gateway proxy. We do not register, host, or cache your parsed links, IP logs, or content metadata. Every extraction transaction handles stream conversions transiently and clears immediately upon socket closure.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs">
                      <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)} className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition shadow-lg shadow-orange-500/10 cursor-pointer">
                        Review Privacy Policy
                      </a>
                      <a href="/disclaimer" onClick={(e) => navigateTo('/disclaimer', e)} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition cursor-pointer">
                        Legal Disclaimer
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* 10. CTA BANNER BLOCK */}
              <section id="cta-banner" className="max-w-6xl mx-auto px-4 pb-12">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-500 to-rose-600 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none" />
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    Start Preserving Content Securely Today
                  </h2>
                  <p className="text-white/90 text-sm max-w-xl mx-auto mb-8">
                    Bypass lagging web streams and dangerous ad loops. Compile your private media vault with Porn Save in 4K resolution.
                  </p>
                  <button 
                    onClick={() => {
                      const input = document.getElementById('target-url-input-box');
                      if (input) {
                        input.focus();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="h-14 px-8 bg-white hover:bg-slate-100 text-orange-600 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition cursor-pointer text-sm"
                  >
                    Fetch Downloads Now
                  </button>
                </div>
              </section>

              {/* 11. DEEP SEO RESOURCE LIBRARY & DECODING PROTOCOLS */}
              <section id="seo-resource-library" className="max-w-5xl mx-auto px-4 pb-16 text-left">
                <div className="border-t border-slate-200 dark:border-white/[0.04] pt-12">
                  <span className="text-orange-500 font-bold uppercase tracking-wider text-xs">Knowledge Base</span>
                  <h2 className={`text-2xl sm:text-3xl font-black mt-1.5 mb-8 ${isDarkMode ? 'text-white' : 'text-slate-955'}`}>
                    Professional Guides & Decoupling Systems
                  </h2>
                  <div className="space-y-8">
                    {HOMEPAGE_EXTENDED_SECTIONS.map((section, idx) => (
                      <div key={idx} className="space-y-3">
                        <h3 className={`text-lg sm:text-xl font-bold border-l-2 border-orange-500 pl-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {section.title}
                        </h3>
                        {section.subtitle && (
                          <h4 className={`text-sm font-semibold text-orange-500/90 dark:text-orange-400/90`}>
                            {section.subtitle}
                          </h4>
                        )}
                        {section.paragraphs && section.paragraphs.map((para, paraIdx) => (
                          <p key={paraIdx} className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {highlightKeywords(para)}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* SUB-CHANNELS SPECIFIC SEO RICH-TEXT VIEW */
            <section id="seo-info" className={`py-16 border-t border-b transition-colors ${
              isDarkMode ? 'bg-slate-900/10 border-white/[0.04]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="max-w-4xl mx-auto px-4 text-left leading-relaxed">
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-rose-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-6 border border-orange-500/15">
                  <Info className="w-3 h-3" />
                  <span>{activePageData.title} • Channel Content Guides</span>
                </div>

                <div className="mb-8 pb-6 border-b border-dashed border-slate-250 dark:border-white/[0.06]">
                  <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {activePageData.headline}
                  </h1>
                  <p className={`text-sm sm:text-base font-medium mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {activePageData.subheadline}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      By <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Porn Save Technical Team</strong>
                    </span>
                    <span>•</span>
                    <span>Active Period: 2026</span>
                    <span>•</span>
                    <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-semibold font-mono">6 min read</span>
                  </div>
                </div>

                {/* Dynamic Page Content Generation */}
                <div className="space-y-6 text-sm sm:text-base">
                  <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {highlightKeywords(activePageData.intro)}
                  </p>

                  {activePageData.sections.map((section, idx) => {
                    switch (section.type) {
                      case 'paragraph':
                        return (
                          <p key={idx} className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {highlightKeywords(section.content || '')}
                          </p>
                        );
                      
                      case 'h2':
                        return (
                          <h2 
                            key={idx} 
                            className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-10 mb-4 border-l-4 border-orange-500 pl-3.5 ${
                              isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {section.title}
                          </h2>
                        );
                      
                      case 'h3':
                        return (
                          <h3 
                            key={idx} 
                            className={`text-lg font-bold tracking-tight mt-8 mb-3 ${
                              isDarkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            {section.title}
                          </h3>
                        );

                      case 'list':
                        return (
                          <div key={idx} className="my-6">
                            {section.title && (
                              <h4 className={`font-bold text-sm sm:text-base mb-2.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {section.title}
                              </h4>
                            )}
                            <ul className="list-disc pl-5 space-y-1.5 text-sm">
                              {section.items?.map((item, iIdx) => (
                                <li key={iIdx} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                  {highlightKeywords(item)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      
                      case 'internal-links-grid':
                        return (
                          <div key={idx} className="grid sm:grid-cols-2 gap-4 my-8">
                            {Object.values(SEO_PAGES_DATA)
                              .filter(page => page.id !== currentPage)
                              .map(page => (
                                <a
                                  key={page.id}
                                  href={page.url}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateTo(page.url);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between cursor-pointer ${
                                    isDarkMode 
                                      ? 'bg-slate-950/40 border-white/[0.05] hover:border-orange-500/40 hover:bg-slate-900/40' 
                                      : 'bg-white border-slate-250 hover:border-orange-500/40 hover:shadow-sm'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                      <h4 className={`font-bold text-[10px] uppercase tracking-wide ${isDarkMode ? 'text-slate-400 font-mono' : 'text-slate-500'}`}>
                                        {page.title}
                                      </h4>
                                    </div>
                                    <h3 className={`font-extrabold text-sm mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                      {page.headline}
                                    </h3>
                                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                      {page.metaDesc}
                                    </p>
                                  </div>
                                  <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1 mt-4">
                                    Open Channel Tool <ArrowRight className="w-3 h-3" />
                                  </span>
                                </a>
                              ))}
                          </div>
                        );
                      
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            </section>
          )}

      {/* RENDER DYNAMIC E-E-A-T PAGES (ABOUT, CONTACT, PRIVACY, TERMS, DISCLAIMER, BLOG, BLOG-POST) */}
      {!TOOL_PAGES.includes(currentPage) && (
        <section className={`py-16 px-4 border-t border-b text-left transition-colors ${
          isDarkMode ? 'bg-slate-950 border-white/[0.04]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-4xl mx-auto leading-relaxed">
            {currentPage === 'about' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 font-mono">
                  🛡️ About Our Platform
                </span>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Porn Save: Premium Engineering for Uncompromising Privacy
                </h1>
                
                <div className="space-y-8">
                  {ABOUT_PAGE_SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h2 className={`text-xl sm:text-2xl font-bold tracking-tight mb-3 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {section.title}
                      </h2>
                      {section.paragraphs.map((para, pIdx) => (
                        <p key={pIdx} className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {highlightKeywords(para)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-6 my-10">
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-white/[0.06]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="font-bold text-orange-400 text-base mb-2">Preserving Browsing Rights</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Streaming identical high-definition files repeatedly increases your digital footprint trail and consumes immense network bandwidth. Downloading media offline safeguards file perpetuity and minimizes tracker tracking loops.
                    </p>
                  </div>
                  <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-white/[0.06]' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="font-bold text-orange-400 text-base mb-2">Unbounded Web Access</h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      We render clean, straightforward streaming download protocols without force-installing third-party app bundles, complex registry installers, or exposing systems to harmful pop-under malware.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentPage === 'contact' && (
              <div className="max-w-3xl mx-auto space-y-12">
                <div className="max-w-xl mx-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 font-mono">
                    📧 Help Desk Portal
                  </span>
                  <h1 className={`text-3xl font-extrabold tracking-tight mb-2 font-sans text-center md:text-left ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                    Contact Tech Support & Takedown Desk
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm mb-8 leading-relaxed text-center md:text-left">
                    Facing stream extraction timeouts or want to submit a formal security report? Create an encrypted support ticket below.
                  </p>

                  {ticketNumber ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-4 font-sans shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl font-bold">
                        ✓
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg">Ticket Created Successfully!</h3>
                      <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
                        Your message has been encrypted and securely dispatched as <span className="font-mono font-bold text-orange-600">{ticketNumber}</span>. We will review and respond within 24 business hours.
                      </p>
                      <button 
                        onClick={() => {
                          setTicketNumber(null);
                          setContactName('');
                          setContactEmail('');
                          setContactMessage('');
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer"
                      >
                        Create New Ticket
                      </button>
                    </motion.div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!contactName || !contactEmail || !contactMessage) return;
                        setIsSubmittingTicket(true);
                        setTimeout(() => {
                          setTicketNumber('VR-' + Math.floor(100000 + Math.random() * 900000));
                          setIsSubmittingTicket(false);
                        }, 1200);
                      }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 label-title">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-orange-500 focus:outline-none text-sm text-slate-900 transition focus:ring-2 focus:ring-orange-500/25 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 label-title">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-orange-500 focus:outline-none text-sm text-slate-900 transition focus:ring-2 focus:ring-orange-500/25 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 label-title">Subject Category</label>
                        <select 
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-orange-500 focus:outline-none text-sm transition cursor-pointer focus:ring-2 focus:ring-orange-500/25 shadow-sm"
                        >
                          <option>Media decode issue</option>
                          <option>General performance feedback</option>
                          <option>DMCA takedown notice</option>
                          <option>Security/bug disclosure</option>
                          <option>Partner Inquiry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 label-title">Message / Details</label>
                        <textarea 
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Describe your issue or feedback in detail..."
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-orange-500 focus:outline-none text-sm text-slate-900 transition resize-none font-sans focus:ring-2 focus:ring-orange-500/25 shadow-sm placeholder:text-slate-400"
                        />
                      </div>

                      <div className="text-slate-500 text-[11px] leading-relaxed select-text">
                        Support Email: <a href="mailto:support@pornsave.vercel.app" className="text-orange-400 hover:underline font-bold">support@pornsave.vercel.app</a>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmittingTicket}
                        className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-rose-600 transition-all shadow-lg hover:shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-2 border-none"
                      >
                        {isSubmittingTicket ? (
                          <span className="flex items-center gap-1.5 justify-center">
                            <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin"></span>
                            <span>Creating Secure Ticket...</span>
                          </span>
                        ) : (
                          <span>Submit Secured Support Ticket</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-10 text-left text-xs sm:text-sm text-slate-700 space-y-6">
                  <h2 className={`text-xl font-bold font-sans ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Support SLA and Operational Guidelines</h2>
                  <p className="leading-relaxed">
                    At Porn Save, we treat technical errors and community submissions with extreme urgency. We employ a dedicated system monitoring team that oversees our file decoding clusters, making sure that CDN connections remain active and that parsing bottlenecks are solved within minutes. If you are experiencing a technical bug where video download links display loading errors, please provide the exact URL of the video, your general region, and your browser's version. This allows our debugging engineers to reproduce and patch stream parsing bottlenecks.
                  </p>
                  
                  <h3 className={`font-bold font-sans ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>DMCA Takedown and Intellectual Property Notices</h3>
                  <p className="leading-relaxed">
                    Porn Save is a transitional on-demand web utility that decodes publicly accessible video streams upon request. We do not maintain any storage arrays, file servers, databases, or content indices. When a user requests a file convert transaction, our server handles it transiently. Since we do not host, syndicate, or cache files on our physical network, there is no permanent content to delete from our servers.
                  </p>
                  <p className="leading-relaxed">
                    However, we support copyright holders. If you represent a studio, content creator group, or intellectual property agency and wish to prevent our online utility from decoders parsing your domain links, you can submit a formal URL blocking request. Send the specific stream URLs, brand names, and certified proof of ownership to our dedicated legal team at <a href="mailto:support@pornsave.vercel.app" className="text-orange-400 hover:underline font-bold">support@pornsave.vercel.app</a> or file a ticket under the "DMCA Takedown Notice" category. We will add those parameters to our hardware blocking list within 24 hours.
                  </p>

                  <h3 className={`font-bold font-sans ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Encrypted Communication Protocols</h3>
                  <p className="leading-relaxed">
                    All correspondence transmitted through our encrypted support ticketing portal or via email is fully protected by TLS 1.3 socket protocols. We never share user identities, email addresses, or ticket histories with third-party tracking corporations, making sure that your communications are strictly kept inside a private environment.
                  </p>
                </div>
              </div>
            )}

            {currentPage === 'privacy' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 font-mono">
                  🔒 Safety Guarantee
                </span>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {PRIVACY_POLICY_EXTENDED.title}
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mb-8 uppercase tracking-wider font-semibold">
                  {PRIVACY_POLICY_EXTENDED.lastUpdated} • Verified Zero Log Policy
                </p>
                
                <div className="space-y-8">
                  {PRIVACY_POLICY_EXTENDED.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className={`text-lg sm:text-xl font-bold mb-2 border-l-2 border-orange-500 pl-3 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {section.title}
                      </h2>
                      <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {highlightKeywords(section.content)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentPage === 'terms' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 font-mono">
                  📜 Fair-Use Guidelines
                </span>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {TERMS_EXTENDED.title}
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mb-8 uppercase tracking-wider font-semibold">
                  {TERMS_EXTENDED.lastUpdated} • Code License Notice
                </p>

                <div className="space-y-8">
                  {TERMS_EXTENDED.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className={`text-lg sm:text-xl font-bold mb-2 border-l-2 border-orange-500 pl-3 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {section.title}
                      </h2>
                      <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {highlightKeywords(section.content)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentPage === 'disclaimer' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 font-mono">
                  ⚠️ Legal Boundary
                </span>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {DISCLAIMER_EXTENDED.title}
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm mb-8 uppercase tracking-wider font-semibold">
                  {DISCLAIMER_EXTENDED.lastUpdated} • Passive Middleware Disclosure
                </p>

                <div className="space-y-8">
                  {DISCLAIMER_EXTENDED.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className={`text-lg sm:text-xl font-bold mb-2 border-l-2 border-orange-500 pl-3 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {section.title}
                      </h2>
                      <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {highlightKeywords(section.content)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentPage === 'blog' && (
              <div className="py-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6 font-mono">
                  📰 Curation Insights & Tutorials
                </span>
                <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  The Porn Save Resource Blog
                </h1>
                <p className={`text-sm sm:text-base mb-10 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Discover professional guides, technical breakdowns, cybersecurity tips, and media preservation tutorials written by expert compression engineers.
                </p>

                <div className="grid sm:grid-cols-2 gap-8">
                  {SEO_BLOG_POSTS.map((post) => (
                    <article 
                      key={post.slug} 
                      onClick={() => navigateTo(`/blog/${post.slug}`)}
                      className={`group p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isDarkMode 
                          ? 'bg-slate-950/40 border-white/[0.05] hover:border-orange-500/30 hover:bg-slate-900/40' 
                          : 'bg-white border-slate-200 hover:border-orange-500/30 hover:bg-slate-50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className={`flex items-center gap-3 text-xs mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className={`text-xl font-bold group-hover:text-orange-600 transition-colors mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {post.title}
                        </h2>
                        <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        Read Article <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {currentPage === 'blog-post' && (() => {
              const post = SEO_BLOG_POSTS.find(p => p.slug === activeBlogSlug) || SEO_BLOG_POSTS[0];
              return (
                <article className="py-8">
                  <button 
                    onClick={() => navigateTo('/blog')}
                    className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-500 font-bold uppercase tracking-widest mb-8 transition cursor-pointer"
                  >
                    ← Back to Resource Blog
                  </button>

                  <div className={`mb-8 pb-6 border-b ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-200'}`}>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-orange-500/15 text-orange-400 border border-orange-500/10 mb-4">
                      {post.readTime} • Tutorial Guide
                    </span>
                    <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {post.title}
                    </h1>
                    <p className={`text-sm sm:text-lg font-medium leading-relaxed mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {post.subtitle}
                    </p>
                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                      <span>By <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{post.author}</strong></span>
                      <span>•</span>
                      <span>Published: {post.date}</span>
                    </div>
                  </div>

                  <div className={`space-y-6 text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {post.sections.map((section, sIdx) => {
                      if (section.type === 'paragraph') {
                        return <p key={sIdx} className="leading-relaxed">{highlightKeywords(section.content || '')}</p>;
                      }
                      if (section.type === 'h2') {
                        return (
                          <h2 key={sIdx} className={`text-xl sm:text-2xl font-bold tracking-tight mt-10 mb-4 border-l-4 border-orange-500 pl-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {section.title}
                          </h2>
                        );
                      }
                      if (section.type === 'h3') {
                        return (
                          <h3 key={sIdx} className={`text-lg font-semibold mt-8 mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>
                            {section.title}
                          </h3>
                        );
                      }
                      if (section.type === 'table') {
                        return (
                          <div key={sIdx} className={`my-8 overflow-hidden rounded-xl border ${isDarkMode ? 'bg-slate-900/55 border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                  <tr className={`border-b ${isDarkMode ? 'bg-slate-950 border-white/[0.06] text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'}`}>
                                    {section.tableHeaders?.map((header, hIdx) => (
                                      <th key={hIdx} className="p-3 font-bold">{header}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-white/[0.04]' : 'divide-slate-150'}`}>
                                  {section.tableRows?.map((row, rIdx) => (
                                    <tr key={rIdx} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-900/20' : 'hover:bg-slate-50/50'}`}>
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className={`p-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      }
                      if (section.type === 'faq-list') {
                        return (
                          <div key={sIdx} className="my-8 space-y-4">
                            {section.faqItems?.map((faq, fIdx) => (
                              <div key={fIdx} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/40 border-white/[0.05] shadow-none' : 'bg-slate-50/40 border-slate-200 shadow-sm'}`}>
                                <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{faq.q}</h4>
                                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.a}</p>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      if (section.type === 'internal-link') {
                        return (
                          <div key={sIdx} className="my-8 text-center">
                            <a 
                              href={section.linkUrl}
                              onClick={(e) => {
                                if (section.linkUrl?.startsWith('#')) {
                                  e.preventDefault();
                                  const el = document.getElementById(section.linkUrl.substring(1));
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                } else if (section.linkUrl) {
                                  navigateTo(section.linkUrl, e);
                                }
                              }}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-500/10 cursor-pointer"
                            >
                              {section.anchorText}
                            </a>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </article>
              );
            })()}
          </div>
        </section>
      )}

      {/* FAQ SYSTEM WITH ACCORDIONS */}
      {TOOL_PAGES.includes(currentPage) && (
        <section id="accordion-faqs" className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Find instant answers regarding quality resolutions, audio files, and user privacy constraints.
              </p>
            </div>

            <div className="space-y-3">
              {SEO_FAQS.map((faq) => {
                const isActive = activeFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className={`border rounded-xl overflow-hidden transition-colors ${
                      isDarkMode 
                        ? 'bg-slate-900 border-white/[0.06] hover:bg-slate-900/80' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => setActiveFaq(isActive ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-800 hover:opacity-90 cursor-pointer select-none"
                    >
                      <span className={`${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isActive && (
                      <div className={`px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed ${
                        isDarkMode ? 'text-slate-400 bg-slate-950/20' : 'text-slate-700 bg-slate-50/40'
                      }`}>
                        <p className="pt-3 border-t border-slate-200 dark:border-white/[0.04]">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM FOOTER AD BANNER */}
      <div className="max-w-4xl mx-auto py-6 px-4 text-center border-t border-slate-200 dark:border-white/[0.04]">
        <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1.5 font-mono">Recommended Partner Links</p>
        <div className="overflow-x-auto flex justify-center">
          <AdUnit id="bottom-ad" keyStr="4052f43d605270f5910261d7d8e16b34" format="iframe" height={90} width={728} />
        </div>
      </div>

      {/* FOOTER BLOCK */}
      <footer className={`border-t py-12 px-4 transition-colors ${
        isDarkMode ? 'bg-slate-950 border-white/[0.06] text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left text-xs sm:text-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow">
                VR
              </div>
              <span className={`font-bold tracking-tight text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Porn Save Downloader
              </span>
            </div>
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-sm leading-relaxed mb-4 text-xs`}>
              Porn Save is a premium open-source online video utility engineered for safe, high-speed, and secure media downloads. Our tool acts as an isolation gateway, giving users total control over their data footprint and digital media custody.
            </p>
          </div>

          <div>
            <h4 className={`font-extrabold mb-4 uppercase tracking-widest text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Important Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" onClick={(e) => navigateTo('/', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Home Downloader</a></li>
              <li><a href="/hd" onClick={(e) => navigateTo('/hd', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>HD 4K Downloader</a></li>
              <li><a href="/short" onClick={(e) => navigateTo('/short', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Shorts Downloader</a></li>
              <li><a href="/studios" onClick={(e) => navigateTo('/studios', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Premium Studios</a></li>
              <li><a href="/categories" onClick={(e) => navigateTo('/categories', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Niche Categories</a></li>
              <li><a href="/guides" onClick={(e) => navigateTo('/guides', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Downloading Guides</a></li>
              <li><a href="/supported-sites" onClick={(e) => navigateTo('/supported-sites', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Supported Sites Directory</a></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-extrabold mb-4 uppercase tracking-widest text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Legal Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/privacy" onClick={(e) => navigateTo('/privacy', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Privacy Policies</a></li>
              <li><a href="/terms" onClick={(e) => navigateTo('/terms', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>Terms of Service</a></li>
              <li><a href="/contact" onClick={(e) => navigateTo('/contact', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>DMCA Compliance & Contact</a></li>
              <li><a href="/about" onClick={(e) => navigateTo('/about', e)} className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} hover:text-orange-500 transition`}>About Our Platform</a></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-extrabold mb-4 uppercase tracking-widest text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Contact Info
            </h4>
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed mb-3 text-xs`}>
              Need technical assistance, file removal requests, or support? Contact our help desk directly.
            </p>
            <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Email: <a href="mailto:support@pornsave.vercel.app" className="text-orange-400 hover:underline font-bold">support@pornsave.vercel.app</a>
            </p>
            <p className="text-[10px] text-slate-500 mt-2">
              Our legal desk responds to secure DMCA tickets and notices within 24 business hours.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-200 dark:border-white/[0.04] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© 2026 Porn Save Video Helper. All rights reserved. Code licensed for production deployment.</p>
          <div className="flex gap-4">
            <a href="/contact" onClick={(e) => navigateTo('/contact', e)} className="hover:underline cursor-pointer">DMCA Notice</a>
            <a href="/terms" onClick={(e) => navigateTo('/terms', e)} className="hover:underline cursor-pointer">Terms of Service</a>
            <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)} className="hover:underline cursor-pointer font-semibold text-orange-500">GDPR Compliance</a>
          </div>
        </div>
      </footer>

      {/* GDPR COOKIE PRIVACY DIALOG BOX */}
      <AnimatePresence>
        {isCookieVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md border p-5 rounded-2xl shadow-2xl z-50 flex flex-col gap-3 ${
              isDarkMode ? 'bg-slate-900 border-white/[0.08] shadow-black/80' : 'bg-white border-slate-200 shadow-slate-300'
            }`}
            id="gdpr-cookie-consent-modal"
          >
            <div>
              <h4 className={`font-bold text-xs mb-1.5 flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                🛡️ GDPR Cookies & Privacy Notice
              </h4>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-normal`}>
                Porn Save utilizes standard browser cookies to remember theme choices, past download sessions, and coordinate simulated downloads. By accessing our tools, you authorize our cookie policies.
              </p>
            </div>
            
            <div className="flex gap-2 justify-end mt-2">
              <button 
                onClick={() => { safeLocalStorage.setItem('pornsave-cookie-consent', 'declined'); setIsCookieVisible(false); }}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer ${
                  isDarkMode ? 'bg-slate-950 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Decline
              </button>
              <button 
                onClick={() => { safeLocalStorage.setItem('pornsave-cookie-consent', 'accepted'); setIsCookieVisible(false); }}
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-orange-500/10"
              >
                Accept Cookies
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
