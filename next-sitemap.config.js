/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://tokodaffa.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin', '/admin/*'], // Prevent Google from indexing admin pages
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://tokodaffa.vercel.app/sitemap.xml', // Replace with custom domain later
    ],
  },
}
