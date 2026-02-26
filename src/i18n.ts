import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'hi'];

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale comes from the [locale] segment or middleware
  let locale = await requestLocale;

  // Validate that the locale is supported, fall back to 'en'
  if (!locale || !locales.includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
