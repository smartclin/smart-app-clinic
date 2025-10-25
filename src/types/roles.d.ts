import { getSession } from '@/lib/auth/auth-server'; // Your Better-Auth instance

import type { UserRole } from './user';

export const checkRole = async (_role: UserRole): Promise<boolean> => {
    const session = await getSession();

    // Assuming Better-Auth stores user role in session.user.role
    const userRole = session?.user?.role?.toLowerCase();

    return userRole === role.toLowerCase();
};

export const getRole = async (): Promise<string> => {
    const session = await getSession();

    // Default to "patient" if role is missing
    const role = session?.user?.role?.toLowerCase() || 'patient';

    return role;
};

export type { Roles };
