import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin as adminPlugin, anonymous, multiSession, twoFactor, username } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { env } from '@/env';
import { generateId } from '@/lib/id';
import { db } from '@/server/db';

import { ac, allRoles } from './permissions';
import { restrictedUsernames } from './usernames';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    url: env.NEXT_PUBLIC_BETTER_AUTH_URL,

    database: prismaAdapter(db, {
        provider: 'postgresql'
    }),
    trustedOrigins: [process.env.CORS_ORIGIN || ''],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        },
        database: {
            generateId: false,
            useNumberId: true
        }
    },

    plugins: [
        username({
            minUsernameLength: 4,
            maxUsernameLength: 10,
            usernameValidator: value => !restrictedUsernames.includes(value),
            usernameNormalization: value => value.toLowerCase()
        }),
        adminPlugin({ ac, roles: allRoles }),
        multiSession(),
        twoFactor(),
        anonymous({
            onLinkAccount: async ({ anonymousUser, newUser }) => {
                const parsedAnonymousUserId = anonymousUser.user.id;
                const parsedNewUserId = newUser.user.id;

                // Start a transaction
                // Delete the existing cart for the new user
                // Start a transaction
                await db.$transaction(async tx => {
                    // Move ownership of the Patients
                    await tx.patient.updateMany({
                        where: {
                            userId: parsedAnonymousUserId
                        },
                        data: {
                            userId: parsedNewUserId
                        }
                    });

                    // Move ownership of the carts
                    await tx.doctor.updateMany({
                        where: {
                            userId: parsedAnonymousUserId
                        },
                        data: {
                            userId: parsedNewUserId
                        }
                    });

                    // Move ownership of the addresses
                    await tx.doctor.updateMany({
                        where: {
                            userId: parsedAnonymousUserId
                        },
                        data: {
                            userId: parsedNewUserId
                        }
                    });

                    // Move ownership of the ClinicMember
                    await tx.clinicMember.updateMany({
                        where: {
                            userId: parsedAnonymousUserId
                        },
                        data: {
                            userId: parsedNewUserId
                        }
                    });

                    // Delete the anonymous user (if needed)
                    await tx.user.delete({
                        where: {
                            id: parsedAnonymousUserId
                        }
                    });
                });
            },

            disableDeleteAnonymousUser: true
        }),
        nextCookies()
    ],
    user: {
        additionalFields: {
            role: { type: 'string', input: false },
            password: { type: 'string', input: true },
            gender: {
                type: 'boolean',
                required: true,
                input: true
            }
        },
        changeEmail: { enabled: true },
        deleteUser: { enabled: true }
    },
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: true
        }
    },
    session: {
        freshAge: 0,
        cookieCache: {
            enabled: true,
            maxAge: ONE_DAY_IN_SECONDS // 1 day
        }
    },

    databaseHooks: {
        user: {
            create: {
                after: async user => {
                    const userId = await generateId();
                    await db.user.create({
                        data: {
                            gender: true,
                            name: user.name,
                            email: user.email,
                            emailVerified: true,
                            id: userId,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    });
                }
            }
        }
    }
});

export const authServer = auth.api;

export async function requireAuth() {
    'use server';

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return notFound();
    }
}

export async function requireAdmin() {
    'use server';

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user.role !== 'admin') {
        return notFound();
    }
}
