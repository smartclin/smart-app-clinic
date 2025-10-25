import 'dotenv/config';

import { generateId } from 'ai';

import { auth } from '@/server/auth';
import { db } from '@/server/db';

const ADMIN_EMAIL = 'clinysmar@gmail.com';
const ADMIN_PASSWORD_PLAINTEXT = 'HealthFact24'; // Plaintext for seeding only
const ADMIN_NAME = 'Hazem Ali';
const CLINIC_NAME = 'Smart Clinic';
const CLINIC_ID = generateId();

async function main() {
    console.log('--- Start Seeding Admin User and Clinic ---');

    let HASHED_PASSWORD: string;
    try {
        // *** IMPORTANT: Replace 'auth.hashPassword' with your actual hashing utility ***
        HASHED_PASSWORD = ADMIN_PASSWORD_PLAINTEXT; // Temporary for demonstration
        console.log('Password HASHING completed successfully.');
    } catch (e) {
        console.error('❌ FATAL: Could not hash password. Ensure hashing utility is available.');
        throw e;
    }

    // --- Ensure Clinic Exists (Upsert) ---
    const clinic = await db.clinic.upsert({
        where: { name: CLINIC_NAME }, // Only check the name here, as it's unique
        update: {},
        create: {
            id: CLINIC_ID,
            name: CLINIC_NAME
        }
    });

    console.log(`🏥 Clinic ensured: ${clinic.name} (${clinic.id})`);

    // --- Check and Create Admin User ---
    let user = await db.user.findUnique({
        where: { email: ADMIN_EMAIL }
    });

    if (user) {
        console.log(`👨‍💻 Admin user already exists: ${user.email}`);
    } else {
        console.log('➕ Creating new admin user via BetterAuth API...');
        try {
            // Create the user via BetterAuth API, this will handle hashing and session creation
            await auth.api.createUser({
                body: {
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD_PLAINTEXT, // Use plaintext for the API call
                    name: ADMIN_NAME,
                    role: 'admin' // Ensure BetterAuth handles this correctly
                }
            });
            console.log(`✅ Admin user created via BetterAuth: ${ADMIN_EMAIL}`);
        } catch (error) {
            console.error('❌ Failed to create admin user via BetterAuth:', error);
            throw error;
        }

        // Synchronize the user with the local application database
        user = await db.user.upsert({
            where: { email: ADMIN_EMAIL },
            update: {
                name: ADMIN_NAME // Update if needed
            },
            create: {
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                emailVerified: true,
                image: '/doctor',
                password: HASHED_PASSWORD, // Ensure password is hashed
                role: 'ADMIN'
            }
        });

        console.log(`✅ Admin user synchronized: ${user.email}`);
    }

    // --- Final Verification ---
    if (!user?.id) {
        throw new Error('❌ Failed to resolve admin user ID after creation.');
    }

    // Example: Link the admin user to the main clinic if required in your schema
    // await db.user.update({
    //     where: { id: user.id },
    //     data: { clinicId: clinic.id },
    // });

    console.log(`👨‍⚕️ Admin doctor profile ensured: ${user.name} (ID: ${user.id})`);
    console.log('--- Seeding Complete ---');
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async e => {
        console.error('❌ Seeder error:', e);
        await db.$disconnect();
        process.exit(1);
    });
