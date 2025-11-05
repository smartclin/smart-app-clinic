// The primary public-facing path of the application
export const publicRoutes: string[] = ['/', '/about', '/contact', '/privacy', '/services', '/terms'];

// The routes used for authentication (login, signup, etc.)
// These pages should redirect authenticated users away.
// Matches paths under /src/app/(auth)
export const authRoutes: string[] = ['/login', '/signup'];

// The prefix for BetterAuth API calls (used for not applying protection logic)
export const apiAuthPrefix: string = '/api/auth';

// The default URL to redirect to after a successful login (the dashboard)
export const DEFAULT_LOGIN_REDIRECT: string = '/dashboard';
