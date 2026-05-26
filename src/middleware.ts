// T021 — Middleware Supabase
// Rôles : session refresh automatique + protection des routes /dashboard

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ⚠️ Ne pas ajouter de code entre createServerClient et auth.getUser()
  // C'est ce qui déclenche le refresh de session si nécessaire
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Routes protegees : tout /ideastream/* (nouveau MVP) + /dashboard,
  // /documents, /projets (legacy, en cours de demantelement).
  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith('/ideastream') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/documents') ||
    path.startsWith('/projets');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/auth');

  // Rediriger vers /login si non authentifié et sur route protégée
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(url);
  }

  // Rediriger vers /ideastream/dashboard si déjà connecté et sur route auth
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/ideastream/dashboard';
    return NextResponse.redirect(url);
  }

  // ⚠️ Toujours retourner supabaseResponse (jamais NextResponse.next())
  // pour préserver les cookies de session rafraîchis
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Matcher toutes les routes SAUF :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico, images publiques
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
