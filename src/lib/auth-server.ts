import { headers } from 'next/headers';

import { auth } from '../server/auth';

export async function getSession() {
    return auth.api.getSession({ headers: await headers() });
}

/**
 * Helper to safely get the user object
 */
export async function getUser() {
    const session = await getSession();
    return session?.user ?? null;
}

// Types
export type Session = typeof auth.$Infer.Session;
export type User = Session['user'];
export type Role = User['role'];
