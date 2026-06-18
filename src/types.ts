export type PlatformType =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'vimeo'
  | 'dailymotion'
  | 'porn'
  | 'generic';

export interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
  views: string;
  platform: PlatformType;
  sourceUrl: string;
}

export interface DownloadFormat {
  id: string;
  label: string;
  quality: string;
  resolution: string;
  size: string;
  extension: 'mp4' | 'mp3' | 'webm';
  type: 'video' | 'audio';
  isMuted?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  domainPattern: RegExp;
  color: string;
  textColor: string;
  iconName: string;
  placeholderTitle: string;
  placeholderAuthor: string;
}
