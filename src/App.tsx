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
  FileCode, 
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Shield,
  Clock,
  ThumbsUp,
  Cpu,
  Bookmark,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUPPORTED_PLATFORMS, SEO_FAQS, DEFAULT_FORMATS, getMockMetadata } from './data.ts';
import { PlatformType, VideoMetadata, DownloadFormat } from './types.ts';
import { generateSingleFileHtml } from './exporter.ts';
import { SEO_BLOG_POST } from './data_blog.ts';
import { SEO_PAGES_DATA } from './pages_data.ts';

function highlightKeywords(text: string) {
  const keywords = [
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

export default function App() {
  // Base State
  const [urlInput, setUrlInput] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('generic');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const isDarkMode = true;
  
  // Active SEO Page state routing
  const [currentPage, setCurrentPage] = useState<'home' | 'hd' | 'short' | 'brazzers' | 'stepmom'>('home');

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#hd-download') {
        setCurrentPage('hd');
        document.title = "HD Porn Video Downloader – Ultra HD 1080p & 4K | Porn Save";
      } else if (hash === '#short-video') {
        setCurrentPage('short');
        document.title = "Porn Short Video Downloader – Fast Portrait Loop Saver | Porn Save";
      } else if (hash === '#brazzers') {
        setCurrentPage('brazzers');
        document.title = "Brazzers Porn Video Downloader – Premium Studios | Porn Save";
      } else if (hash === '#stepmom') {
        setCurrentPage('stepmom');
        document.title = "Stepmom Porter – Family Fantasy & Regional Downloader | Porn Save";
      } else {
        setCurrentPage('home');
        document.title = "Porn Save – Free Online Porn Video Downloader | Best Adult Downloader 2025";
      }
      // Scroll smoothly to top when switching page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initialize
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
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
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [copiedUrlSuccess, setCopiedUrlSuccess] = useState(false);

  // Trigger cookie display on load
  useEffect(() => {
    const choice = localStorage.getItem('pornsave-cookie-consent');
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

  // Fetch / Extract options simulator
  const handleExtractMedia = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please provide a valid streaming URL from YouTube, Instagram, Facebook, TikTok, or other media sources.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMetadata(null);
    setProgress(prev => ({ ...prev, isActive: false }));

    // Simulate link decryption
    setTimeout(() => {
      setIsLoading(false);
      const conf = SUPPORTED_PLATFORMS.find(p => p.id === platform) || SUPPORTED_PLATFORMS[SUPPORTED_PLATFORMS.length - 1];
      const mockMeta = getMockMetadata(trimmed, conf);
      
      setMetadata({
        id: Math.random().toString(36).substr(2, 9),
        title: mockMeta.title,
        author: mockMeta.author,
        thumbnail: mockMeta.thumbnail,
        duration: mockMeta.duration,
        views: mockMeta.views,
        platform: platform,
        sourceUrl: trimmed
      });
    }, 1200);
  };

  // Simulated download process
  const triggerSimulation = (format: DownloadFormat) => {
    setProgress({
      percent: 0,
      speed: 'Initializing session...',
      status: 'Validating server handshake...',
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
      currentPercent += Math.floor(Math.random() * 8) + 4;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
        
        setProgress(prev => ({
          ...prev,
          percent: 100,
          speed: 'Finished',
          status: 'Triggering local file store...'
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
          setProgress(prev => ({ ...prev, status: 'Completed! File compiled and delivered safely.' }));
        }, 500);

      } else {
        setProgress(prev => ({
          ...prev,
          percent: currentPercent,
          speed: `Speed: ${(28 + Math.random() * 24).toFixed(1)} MB/s`,
          status: currentPercent < 35 
            ? 'Accessing high-bandwidth proxy...' 
            : currentPercent < 75 
              ? 'Parsing stream chunks and audio signals...' 
              : 'Assembling muxed file blocks...'
        }));
      }
    }, 150);
  };

  // Copy dynamic single page HTML code template to user
  const handleCopyEmbeddedCode = () => {
    const htmlCode = generateSingleFileHtml();
    navigator.clipboard.writeText(htmlCode);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 2500);
  };

  // Download high-fidelity index.html template attachment directly
  const handleDownloadEmbeddedTemplate = () => {
    const htmlCode = generateSingleFileHtml();
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
              PS
            </div>
            <div>
              <span className={`font-bold text-xl tracking-tight bg-gradient-to-r ${isDarkMode ? 'from-orange-400 to-white' : 'from-orange-500 to-slate-800'} bg-clip-text text-transparent`}>
                Porn Save
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-white/5 dark:bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                Beta v2.1
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold">
            <a href="#" className={`pb-1 border-b-2 transition-all ${currentPage === 'home' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-orange-500'}`}>Home</a>
            <a href="#hd-download" className={`pb-1 border-b-2 transition-all ${currentPage === 'hd' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-orange-500'}`}>HD 4K</a>
            <a href="#short-video" className={`pb-1 border-b-2 transition-all ${currentPage === 'short' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-orange-500'}`}>Shorts</a>
            <a href="#brazzers" className={`pb-1 border-b-2 transition-all ${currentPage === 'brazzers' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-orange-500'}`}>Studios</a>
            <a href="#stepmom" className={`pb-1 border-b-2 transition-all ${currentPage === 'stepmom' ? 'text-orange-500 border-orange-500' : 'text-slate-400 border-transparent hover:text-orange-500'}`}>Categories</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Embedded Source Downloader Badge */}
            <a 
              href="#developer-code-hub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/25 transition cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Get Static HTML</span>
            </a>
          </div>
        </div>
      </header>

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
              href="#"
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
              href="#hd-download"
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
              href="#short-video"
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
              href="#brazzers"
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
              href="#stepmom"
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
          </div>

          <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {activePageData.id === 'home' && <>Free <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Porn Video Downloader</span></>}
            {activePageData.id === 'hd' && <>HD & 4K <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Porn Video Downloader</span></>}
            {activePageData.id === 'short' && <>Porn <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Short Video Downloader</span></>}
            {activePageData.id === 'brazzers' && <>Premium <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Studio Downloader</span></>}
            {activePageData.id === 'stepmom' && <>Stepmom <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Category Downloader</span></>}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
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
                      : 'bg-slate-100 text-slate-900 border-slate-200 placeholder:text-slate-400'
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

          {/* QUICK SERVICE SELECTION BADGES */}
          <div className="mt-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">
              SUPPORTED HIGH-BANDWIDTH MULTIMEDIA DOMAINS
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {SUPPORTED_PLATFORMS.map((site) => (
                <div 
                  key={site.id}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all hover:scale-105 duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-900/40 border-white/[0.06] text-slate-300' 
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${site.color}`} />
                  <span>{site.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* THREE STEP HOW-TO-USE */}
      <section id="how" className={`py-16 border-t border-b transition-colors ${
        isDarkMode ? 'bg-slate-900/30 border-white/[0.04]' : 'bg-slate-100/60 border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            How It Works in 3 Quick Steps
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-12">
            No dynamic client dependencies required files resolve completely on inside browser frames.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Box 1 */}
            <div className={`p-6 rounded-2xl relative border ${
              isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-orange-500 font-extrabold text-white flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-5 mt-2">
                <Copy className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Copy sharing link
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open target platform (e.g. YouTube app), copy the video streaming link from direct browse path or sharing overlay.
              </p>
            </div>

            {/* Box 2 */}
            <div className={`p-6 rounded-2xl relative border ${
              isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-rose-600 font-extrabold text-white flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 mt-2">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Paste and query
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Insert paste coordinates inside our top box. The system runs real-time stream scanning to identify original qualities.
              </p>
            </div>

            {/* Box 3 */}
            <div className={`p-6 rounded-2xl relative border ${
              isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-pink-600 font-extrabold text-white flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/10 text-pink-500 flex items-center justify-center mb-5 mt-2">
                <Download className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Save media offline
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click download under your requested format. The raw multiplexed data compiles directly to your desktop or phone storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE SPECIAL EXPORTER PANEL BLOCK */}
      <section id="developer-code-hub" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-semibold mb-3">
              <FileCode className="w-3.5 h-3.5" />
              For Deployment & Hosting Anywhere
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Developer Exporter Utility
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              In accordance with your target specification, we have packaged a completely self-contained, lightweight <strong>single-file HTML</strong> version. Copy or download the clean layout to serve on static hostings immediately!
            </p>
          </div>

          <div className={`border rounded-2xl overflow-hidden shadow-xl ${
            isDarkMode ? 'bg-slate-900 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className={`px-5 py-4 flex items-center justify-between border-b ${
              isDarkMode ? 'bg-slate-950/80 border-white/[0.08]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-mono font-bold text-slate-400 ml-1">index.html (Self-contained)</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyEmbeddedCode}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copyCodeSuccess ? <Check className="w-3.5 h-3.5 text-green-450" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copyCodeSuccess ? 'Copied code!' : 'Copy raw code'}</span>
                </button>

                <button 
                  onClick={handleDownloadEmbeddedTemplate}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:opacity-90 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download index.html</span>
                </button>
              </div>
            </div>

            <div className={`p-4 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto ${
              isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-900 text-slate-300'
            }`}>
              <pre>{generateSingleFileHtml()}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* SEO HIGH QUALITY SPECIFIC RICH-TEXT FOR INDEXING */}
      <section id="seo-info" className={`py-16 border-t border-b transition-colors ${
        isDarkMode ? 'bg-slate-900/10 border-white/[0.04]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 leading-relaxed">
          <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500/10 to-rose-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-6 border border-orange-500/15">
            <Info className="w-3 h-3" />
            <span>{activePageData.title} • Channel Content Guides</span>
          </div>

          <div className="mb-8 pb-6 border-b border-dashed border-slate-200 dark:border-white/[0.06]">
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activePageData.headline}
            </h1>
            <p className={`text-sm sm:text-base font-medium mb-4 ${isDarkMode ? 'text-slate-350' : 'text-slate-650'}`}>
              {activePageData.subheadline}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                By <strong className={isDarkMode ? 'text-slate-350' : 'text-slate-700'}>Porn Save Editor</strong>
              </span>
              <span>•</span>
              <span>Active Period: 2025 - 2026</span>
              <span>•</span>
              <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-semibold">6 min read</span>
            </div>
          </div>

          {/* Dynamic Page Content Generation */}
          <div className="space-y-6 text-sm sm:text-base">
            <p className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-slate-350' : 'text-slate-650'}`}>
              {highlightKeywords(activePageData.intro)}
            </p>

            {activePageData.sections.map((section, idx) => {
              switch (section.type) {
                case 'paragraph':
                  return (
                    <p key={idx} className={`leading-relaxed text-sm sm:text-base ${isDarkMode ? 'text-slate-350' : 'text-slate-600'}`}>
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
                        isDarkMode ? 'text-slate-205' : 'text-slate-800'
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
                          <li key={iIdx} className={isDarkMode ? 'text-slate-350' : 'text-slate-600'}>
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
                            className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between cursor-pointer ${
                              isDarkMode 
                                ? 'bg-slate-950/40 border-white/[0.05] hover:border-orange-500/40 hover:bg-slate-900/40' 
                                : 'bg-white border-slate-250/70 hover:border-orange-500/40 hover:shadow-sm'
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
                              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
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

          {/* Append default tables & comparisons on Home tab */}
          {currentPage === 'home' && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/[0.06] space-y-6">
              <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mb-4 border-l-4 border-orange-500 pl-3.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Platform Comparison Matrix
              </h2>
              {/* Blog Table Section */}
              {SEO_BLOG_POST.sections.filter(s => s.type === 'table').map((section, idx) => (
                <div key={idx} className="my-8 overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06] shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className={isDarkMode ? 'bg-slate-950/60 text-slate-250 border-b border-white/[0.06]' : 'bg-slate-100 text-slate-800 border-b border-slate-200'}>
                          {section.tableHeaders?.map((header, hIdx) => (
                            <th key={hIdx} className="p-3 sm:p-4 font-bold">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {section.tableRows?.map((row, rIdx) => (
                          <tr 
                            key={rIdx} 
                            className={`${
                              isDarkMode 
                                ? 'hover:bg-white/[0.02] text-slate-300' 
                                : 'hover:bg-slate-50 text-slate-600'
                            } ${rIdx % 2 === 1 ? (isDarkMode ? 'bg-white/[0.01]' : 'bg-slate-50/50') : ''}`}
                          >
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 sm:p-4 max-w-[200px] sm:max-w-xs truncate-none whitespace-normal leading-relaxed text-xs">
                                {cell.includes('Porn Save') || cell.includes('LoadJet') ? (
                                  <span className="font-bold text-orange-500">Porn Save Downloader</span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* FAQ SYSTEM WITH ACCORDIONS */}
      <section id="accordion-faqs" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
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
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-300 hover:opacity-90 cursor-pointer select-none"
                  >
                    <span className={`${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isActive && (
                    <div className={`px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed ${
                      isDarkMode ? 'text-slate-400 bg-slate-950/20' : 'text-slate-600 bg-slate-50/40'
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

      {/* FOOTER BLOCK */}
      <footer className={`border-t py-12 px-4 transition-colors ${
        isDarkMode ? 'bg-slate-950 border-white/[0.06] text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8 text-left text-xs sm:text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow">
                PS
              </div>
              <span className={`font-bold tracking-tight text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Porn Save Downloader
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-4 text-xs">
              Secure, free, and unrestricted online video downloader helper. Instantly rip high bandwidth streaming clips to direct storage on your computer. Please check local fair-use policies.
            </p>
          </div>

          <div>
            <h4 className={`font-extrabold mb-4 uppercase tracking-widest text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Platform links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tool-hero" className="hover:text-orange-500 transition">Video Downloader</a></li>
              <li><a href="#how" className="hover:text-orange-500 transition">How It Works</a></li>
              <li><a href="#seo-info" className="hover:text-orange-500 transition">SEO Strategy</a></li>
              <li><a href="#accordion-faqs" className="hover:text-orange-500 transition">FAQ Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-extrabold mb-4 uppercase tracking-widest text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Legal Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Privacy Policies</li>
              <li>Terms of Service</li>
              <li>DMCA Takedown Compliance</li>
              <li>Google Analytics integration</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-200 dark:border-white/[0.04] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© 2026 Porn Save Video Helper. All rights reserved. Code licensed for production deployment.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">DMCA Notice</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer font-semibold text-orange-500">GDPR Compliance</span>
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
              <p className="text-[11px] text-slate-450 leading-normal">
                Porn Save utilizes standard browser cookies to remember theme choices, past download sessions, and coordinate simulated downloads. By accessing our tools, you authorize our cookie policies.
              </p>
            </div>
            
            <div className="flex gap-2 justify-end mt-2">
              <button 
                onClick={() => { localStorage.setItem('pornsave-cookie-consent', 'declined'); setIsCookieVisible(false); }}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer ${
                  isDarkMode ? 'bg-slate-950 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Decline
              </button>
              <button 
                onClick={() => { localStorage.setItem('pornsave-cookie-consent', 'accepted'); setIsCookieVisible(false); }}
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
