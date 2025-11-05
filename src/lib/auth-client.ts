import {
    adminClient,
    anonymousClient,
    customSessionClient,
    inferAdditionalFields,
    multiSessionClient,
    passkeyClient,
    twoFactorClient,
    usernameClient
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from '@/env';
import { ac, allRoles } from '@/server/auth/permissions';

import type { auth } from '../server/auth';

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL ?? '',
    plugins: [
        adminClient({
            ac,
            roles: allRoles
        }),
        twoFactorClient(),
        passkeyClient(),
        multiSessionClient(),
        customSessionClient<typeof auth>(),
        usernameClient(),
        anonymousClient(),
        inferAdditionalFields<typeof auth>()
    ]
});

export const {
    signIn,
    signOut,
    signUp,
    updateUser,
    changePassword,
    changeEmail,
    deleteUser,
    useSession,
    revokeSession,
    resetPassword,
    linkSocial,
    forgetPassword,
    listAccounts,
    listSessions,
    revokeOtherSessions,
    revokeSessions
} = authClient;
