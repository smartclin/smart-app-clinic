import type { LocalePrefixMode } from 'next-intl/routing';

export interface TwitterConfig {
    username: string;
    card: 'summary' | 'summary_large_image' | 'player' | 'app';
    img: string;
    imgAlt: string;
    title: string; // changed to string for flexibility
}

export interface OGConfig {
    imgType: string;
    imgWidth: string;
    imgHeight: string;
}

export interface LocaleConfig {
    locales: string[];
    defaultLocale: string;
    localePrefix: LocalePrefixMode;
    timeZone: string;
}

export interface GithubConfig {
    repoLink: string;
}

export interface SiteConfig {
    title: string;
    description: string;
    featuredImage: string;
    favicon: string;
    lightAccentColor: string;
    darkAccentColor: string;
    og: OGConfig;
    twitter: TwitterConfig;
    github: GithubConfig;
}
