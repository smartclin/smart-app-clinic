import type { SiteConfig } from '@/types/config';

const siteConfig: SiteConfig = {
    title: 'Smart Clinic - Pediatric Care App',
    description:
        'Smart Clinic helps parents manage their children’s health easily. Book appointments, track immunizations, and access pediatric care online.',
    featuredImage: '/static/images/smart-clinic-logo.svg',
    favicon: '/static/favicons/favicon.ico',
    github: {
        repoLink: 'https://github.com/yourusername/smart-clinic' // update with your repo
    },

    lightAccentColor: '#4CAF50', // pediatric-friendly green
    darkAccentColor: '#388E3C',
    twitter: {
        username: '@smartclinic',
        card: 'summary',
        img: '/static/images/logo.svg',
        imgAlt: 'Smart Clinic Logo',
        title: 'Smart Clinic - Pediatric Care App'
    },
    og: {
        imgType: '/static/images/logo.svg',
        imgHeight: '630',
        imgWidth: '1200'
    }
};

export default siteConfig;
