'use client';

import React, { useCallback, useContext, useMemo } from 'react';

import { type authClient, useSession } from '@/lib/auth-client';
import { allRoles } from '@/server/auth/permissions';

export type Session = typeof authClient.$Infer.Session;
export type User = Session['user'];
export type Role = User['role'];

// Define the shape of a User with a role
type UserWithRole = User & { role: string };

// Define the shape of the authentication session
export type AuthSession = {
    user: UserWithRole | null;
    session: Session | null;
};

// Create the React Context for authentication
const AuthContext = React.createContext<AuthSession | null>(null);

/**
 * AuthProvider component to wrap your application and provide authentication context.
 * @param props - React props including children and the auth session.
 */
export function AuthProvider(
    props: React.PropsWithChildren<{
        auth: AuthSession | null;
    }>
) {
    const { data: session } = useSession();

    const authState: AuthSession = useMemo(() => {
        if (session) {
            return {
                user: session.user as UserWithRole,
                session: session
            };
        }
        return { user: null, session: null };
    }, [session]);

    return <AuthContext.Provider value={authState}>{props.children}</AuthContext.Provider>;
}

/**
 * Custom hook to access the authentication session from the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 * @returns The authentication session.
 */
export function useAuth(): AuthSession {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

/**
 * Custom hook for access control, providing utilities to check roles and permissions.
 * @returns An object containing roles, hasPermission, hasRole, and getRolePermissions functions.
 */
export function useAccessControl() {
    const auth = useAuth();

    // Memoize the roles to prevent unnecessary re-renders
    const roles = useMemo(() => {
        // Ensure the role string is split and cast correctly
        return (auth?.user?.role?.split(',') as Array<keyof typeof allRoles>) || [];
    }, [auth?.user?.role]);

    // Memoize hasPermission for performance
    const hasPermission = useCallback(() => {
        // Iterate through assigned roles to check for permission
        for (const role of roles) {
            // Use optional chaining (?.) to safely access 'authorize' and 'success'
            if (allRoles[role].authorize) {
                return true;
            }
        }
        return false;
    }, [roles]);

    // Memoize hasRole for performance
    const hasRole = useCallback(
        (role: keyof typeof allRoles) => {
            return roles.includes(role);
        },
        [roles]
    );

    // Memoize getRolePermissions for performance
    const getRolePermissions = useCallback((role: keyof typeof allRoles) => {
        // Return statements for a specific role, if it exists
        return allRoles[role]?.statements || [];
    }, []);

    return {
        roles,
        hasPermission,
        hasRole,
        getRolePermissions
    };
}
