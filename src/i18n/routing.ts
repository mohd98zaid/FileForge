import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',  // English URLs have no prefix, Hindi uses /hi
    localeDetection: false      // Disable automatic redirect based on browser headers
});
