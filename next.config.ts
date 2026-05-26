import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Redirige les anciennes routes (legacy Proxiwave v1-v3) vers leurs
  // equivalents IdeaStream v4. Permet de ne pas perdre les utilisateurs
  // qui auraient bookmarke /dashboard, /documents ou /projets.
  //
  // permanent: false → 307 (temporary). On garde la possibilite de
  // demanteler les redirects une fois que les anciennes routes sont
  // retirees du code, sans casser le SEO.
  async redirects() {
    return [
      { source: '/dashboard', destination: '/ideastream/dashboard', permanent: false },
      { source: '/dashboard/:path*', destination: '/ideastream/dashboard', permanent: false },
      { source: '/documents', destination: '/ideastream/dashboard', permanent: false },
      { source: '/projets', destination: '/ideastream/projects', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
