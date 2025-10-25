// prisma/seed.ts

import { faker } from '@faker-js/faker';
import {
    type Appointment,
    AppointmentStatus,
    type Clinic,
    type Doctor,
    type Gender,
    type MeasurementType,
    type Patient,
    type Prisma,
    PrismaClient,
    type Services,
    type User
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await clearDatabase();

    // Create base users with different roles
    const { adminUsers, doctorUsers, staffUsers, patientUsers } = await createUsers();

    // Create clinics
    const clinics = await createClinics();

    // Create clinic memberships
    await createClinicMemberships(adminUsers, doctorUsers, staffUsers, clinics);
    clinics;
    // Create patients
    const patients = await createPatients(patientUsers, clinics);

    // Create doctors with working days
    const doctors = await createDoctors(doctorUsers, clinics);

    // Create staff
    await createStaff(staffUsers);

    // Create services
    const services = await createServices();

    // Create appointments
    const appointments = await createAppointments(patients, doctors, services, clinics);

    // Create medical records and related data
    await createMedicalData(patients, doctors, appointments);

    // Create billing and payments
    await createBillingAndPayments(patients, appointments);

    // Create growth charts
    await createGrowthCharts(patients);

    // Create immunizations
    await createImmunizations(patients);

    // Create feeding logs
    await createFeedingLogs(patients);

    // Create notifications
    await createNotifications([...adminUsers, ...doctorUsers, ...staffUsers, ...patientUsers]);

    // Create WHO growth standards
    await createWHOGrowthStandards();

    // Create sample todos
    await createTodos();

    console.log('✅ Database seeding completed!');
}

async function clearDatabase() {
    console.log('🗑️ Clearing existing data...');

    const models: (keyof PrismaClient)[] = [
        'todo',
        'wHOGrowthStandard',
        'prescription',
        'services',
        'diagnosis',
        'notification',
        'billing',
        'feedingLog',
        'growthChart',
        'immunization',
        'vitalSigns',
        'encounter',
        'medicalRecords',
        'labTest',
        'patientBills',
        'reminder',
        'payment',
        'appointment',
        'workingDays',
        'staff',
        'doctor',
        'patient',
        'clinicMember',
        'clinic',
        'twoFactor',
        'verification',
        'account',
        'session',
        'user'
    ];

    for (const model of models) {
        try {
            // Dynamically access the model and cast it to the correct Prisma model type
            // biome-ignore lint/suspicious/noExplicitAny: <ok>
            const modelInstance = prisma[model as keyof PrismaClient] as any;
            if (modelInstance && typeof modelInstance.deleteMany === 'function') {
                await modelInstance.deleteMany({});
                console.log(`Successfully cleared ${'model'}`);
            } else {
                console.log(`Model ${'model'} does not exist on Prisma client`);
            }
        } catch (_error) {
            console.log(`Note: Could not clear ${'model'}, might not exist yet`);
        }
    }
}

async function createUsers() {
    console.log('👥 Creating users...');

    const adminUsers = [];
    const doctorUsers = [];
    const staffUsers = [];
    const patientUsers = [];

    // Create admin users
    for (let i = 0; i < 2; i++) {
        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: `admin${i + 1}@smartclinic.com`,
                emailVerified: true,
                image: faker.image.avatar(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                username: `admin${i + 1}`,
                displayUsername: `Admin ${i + 1}`,
                role: 'ADMIN',
                banned: false,
                twoFactorEnabled: false,
                password: await hash('password123', 12)
            }
        });
        adminUsers.push(user);
    }

    // Create doctor users
    for (let i = 0; i < 8; i++) {
        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: `doctor${i + 1}@smartclinic.com`,
                emailVerified: true,
                image: faker.image.avatar(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                username: `doctor${i + 1}`,
                displayUsername: `Dr. ${faker.person.lastName()}`,
                role: 'DOCTOR',
                banned: false,
                twoFactorEnabled: false,
                password: await hash('password123', 12)
            }
        });
        doctorUsers.push(user);
    }

    // Create staff users
    for (let i = 0; i < 6; i++) {
        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: `staff${i + 1}@smartclinic.com`,
                emailVerified: true,
                image: faker.image.avatar(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                username: `staff${i + 1}`,
                displayUsername: `Staff ${i + 1}`,
                role: 'STAFF',
                banned: false,
                twoFactorEnabled: false,
                password: await hash('password123', 12)
            }
        });
        staffUsers.push(user);
    }

    // Create patient users
    for (let i = 0; i < 50; i++) {
        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                emailVerified: true,
                image: faker.image.avatar(),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent(),
                username: `patient${i + 1}`,
                displayUsername: `Patient ${i + 1}`,
                role: 'PATIENT',
                banned: false,
                twoFactorEnabled: false,
                password: await hash('password123', 12)
            }
        });
        patientUsers.push(user);
    }

    return { adminUsers, doctorUsers, staffUsers, patientUsers };
}

async function createClinics() {
    console.log('🏥 Creating clinics...');

    const clinics = await Promise.all([
        prisma.clinic.create({
            data: {
                name: 'Smart Pediatric Clinic - Main Branch',
                description: 'Main pediatric healthcare center in Hurghada',
                address: '123 Healthcare Street, Hurghada, Red Sea, Egypt',
                phone: '+20-123-456-7890',
                email: 'main@smartclinic.com'
            }
        }),
        prisma.clinic.create({
            data: {
                name: 'Smart Pediatric Clinic - El Kawther Branch',
                description: 'Specialized pediatric care in El Kawther district',
                address: '456 Medical Avenue, El Kawther, Hurghada, Egypt',
                phone: '+20-123-456-7891',
                email: 'kawther@smartclinic.com'
            }
        })
    ]);

    return clinics;
}

async function createClinicMemberships(adminUsers: User[], doctorUsers: User[], staffUsers: User[], clinics: Clinic[]) {
    console.log('🔗 Creating clinic memberships...');

    // Add admins to all clinics
    for (const admin of adminUsers) {
        for (const clinic of clinics) {
            await prisma.clinicMember.create({
                data: {
                    userId: admin.id,
                    clinicId: clinic.id,
                    role: 'ADMIN'
                }
            });
        }
    }

    // Add doctors to clinics (distribute them)
    for (let i = 0; i < doctorUsers.length; i++) {
        const clinic = clinics[i % clinics.length];
        await prisma.clinicMember.create({
            data: {
                userId: doctorUsers[i]?.id ?? '',
                clinicId: clinic?.id ?? '',
                role: 'DOCTOR'
            }
        });
    }

    // Add staff to clinics
    for (let i = 0; i < staffUsers.length; i++) {
        const clinic = clinics[i % clinics.length];
        await prisma.clinicMember.create({
            data: {
                userId: staffUsers[i]?.id ?? '',
                clinicId: clinic?.id ?? '',
                role: 'STAFF'
            }
        });
    }
}

async function createPatients(patientUsers: User[], _clinics: Clinic[]) {
    console.log('👶 Creating patients...');

    const patients = [];
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const allergies = ['Penicillin', 'Peanuts', 'Dust', 'Pollen', 'None'];
    const conditions = ['Asthma', 'Diabetes', 'ADHD', 'None', 'Eczema'];

    for (let i = 0; i < patientUsers.length; i++) {
        const user = patientUsers[i];
        const birthDate = faker.date.between({
            from: new Date('2010-01-01'),
            to: new Date('2023-12-31')
        });

        const patient = await prisma.patient.create({
            data: {
                id: user?.id ?? '',
                firstName: user?.name.split(' ')[0] ?? '',
                lastName: user?.name.split(' ')[1] || 'Family',
                userId: user?.id ?? '',
                dateOfBirth: birthDate,
                gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
                phone: faker.phone.number(),
                email: user?.email ?? '',
                nutritionalStatus: faker.helpers.arrayElement(['Normal', 'Underweight', 'Overweight']),
                address: faker.location.streetAddress(),
                emergencyContactName: faker.person.fullName(),
                emergencyContactNumber: faker.phone.number(),
                relation: faker.helpers.arrayElement(['Mother', 'Father', 'Grandparent']),
                bloodGroup: faker.helpers.arrayElement(bloodGroups),
                allergies: faker.helpers.arrayElement(allergies),
                medicalConditions: faker.helpers.arrayElement(conditions),
                medicalHistory: faker.lorem.sentence(),
                image: faker.image.avatar(),
                colorCode: faker.color.rgb(),
                role: 'PATIENT'
            }
        });
        patients.push(patient);
    }

    return patients;
}
// Define the type for DoctorCreateInput from Prisma
type DoctorUser = Prisma.DoctorCreateInput;

async function createDoctors(doctorUsers: User[], _clinics: Clinic[]) {
    console.log('👨‍⚕️ Creating doctors...');

    const doctors = [];
    const specializations = [
        'Pediatric Cardiology',
        'Pediatric Neurology',
        'General Pediatrics',
        'Pediatric Surgery',
        'Neonatology',
        'Pediatric Allergy',
        'Pediatric Endocrinology'
    ];

    for (let i = 0; i < doctorUsers.length; i++) {
        const user = doctorUsers[i];

        // Make sure required fields are populated (like specialization and user)
        const doctorData: DoctorUser = {
            id: user.id ?? faker.string.uuid(),
            email: user.email ?? faker.internet.email(),
            name: user.name ?? faker.person.fullName(),
            specialization: faker.helpers.arrayElement(specializations),
            licenseNumber: `MD-${faker.number.int(999999)}`,
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            department: 'Pediatrics',
            img: faker.image.avatar(),
            colorCode: faker.color.rgb(),
            availabilityStatus: faker.helpers.arrayElement(['Available', 'Busy', 'On Leave']),
            type: faker.helpers.arrayElement(['FULL', 'PART']),
            role: 'DOCTOR' as const, // Fix role type
            user: {
                create: undefined,
                connectOrCreate: undefined,
                connect: undefined
            }
        };

        // Create the doctor using the correct data
        const doctor = await prisma.doctor.create({
            data: doctorData
        });

        // Create working days for each doctor
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        for (const day of days) {
            await prisma.workingDays.create({
                data: {
                    doctorId: doctor.id,
                    day: day,
                    startTime: '08:00',
                    closeTime: '16:00'
                }
            });
        }

        doctors.push(doctor);
    }

    return doctors;
}

async function createStaff(staffUsers: User[]) {
    console.log('👩‍💼 Creating staff...');

    const departments = ['Nursing', 'Administration', 'Laboratory', 'Pharmacy', 'Reception'];

    for (let i = 0; i < staffUsers.length; i++) {
        const user = staffUsers[i];
        await prisma.staff.create({
            data: {
                id: user?.id ?? '',
                email: user?.email ?? '',
                name: user?.name ?? '',
                phone: faker.phone.number(),
                userId: user?.id ?? '',
                address: faker.location.streetAddress(),
                department: faker.helpers.arrayElement(departments),
                img: faker.image.avatar(),
                licenseNumber: `STF-${faker.string.numeric(6)}`,
                colorCode: faker.color.rgb(),
                hireDate: faker.date.past({ years: 3 }),
                salary: faker.number.float({ min: 3000, max: 8000, fractionDigits: 2 }),
                role: 'STAFF',
                status: 'ACTIVE'
            }
        });
    }
}

async function createServices() {
    console.log('🩺 Creating services...');

    const services = await Promise.all([
        prisma.services.create({
            data: {
                serviceName: 'General Consultation',
                description: 'Routine pediatric checkup and consultation',
                price: 150.0,
                category: 'CONSULTATION',
                duration: 30
            }
        }),
        prisma.services.create({
            data: {
                serviceName: 'Vaccination',
                description: 'Child immunization vaccination',
                price: 80.0,
                category: 'VACCINATION',
                duration: 15
            }
        }),
        prisma.services.create({
            data: {
                serviceName: 'Blood Test',
                description: 'Complete blood count test',
                price: 120.0,
                category: 'LAB_TEST',
                duration: 45
            }
        }),
        prisma.services.create({
            data: {
                serviceName: 'Emergency Consultation',
                description: 'Urgent pediatric care',
                price: 300.0,
                category: 'CONSULTATION',
                duration: 60
            }
        }),
        prisma.services.create({
            data: {
                serviceName: 'Growth Assessment',
                description: 'Comprehensive growth and development evaluation',
                price: 200.0,
                category: 'DIAGNOSIS',
                duration: 45
            }
        })
    ]);

    return services;
}

async function createAppointments(patients: Patient[], doctors: Doctor[], services: Services[], _clinics: Clinic[]) {
    console.log('📅 Creating appointments...');

    const appointments = [];
    const types = ['Checkup', 'Vaccination', 'Follow-up', 'Emergency'];

    for (let i = 0; i < 100; i++) {
        const patient = faker.helpers.arrayElement(patients);
        const doctor = faker.helpers.arrayElement(doctors);
        const service = faker.helpers.arrayElement(services);
        const appointmentDate = faker.date.soon({ days: 30 });

        const appointment = await prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                serviceId: service.id,
                syntheticKey: faker.string.uuid(),
                appointmentDate: appointmentDate,
                time: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '14:00', '15:00']),
                status: faker.helpers.enumValue(AppointmentStatus),
                type: faker.helpers.arrayElement(types),
                note: faker.lorem.sentence(),
                reason: faker.lorem.sentence()
            }
        });
        appointments.push(appointment);
    }

    return appointments;
}

async function createMedicalData(_patients: Patient[], _doctors: Doctor[], appointments: Appointment[]) {
    console.log('📋 Creating medical records and related data...');

    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED');

    for (const appointment of completedAppointments.slice(0, 60)) {
        // Create medical record
        const medicalRecord = await prisma.medicalRecords.create({
            data: {
                patientId: appointment.patientId,
                appointmentId: appointment.id,
                doctorId: appointment.doctorId,
                treatmentPlan: faker.lorem.paragraph(),
                prescriptions: faker.lorem.sentence(),
                labRequest: faker.helpers.arrayElement(['Blood Test', 'Urine Test', 'X-Ray', 'None']),
                notes: faker.lorem.paragraph()
            }
        });

        // Create encounter
        const encounter = await prisma.encounter.create({
            data: {
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                date: appointment.appointmentDate,
                type: appointment.type,
                diagnosis: faker.lorem.sentence(),
                treatment: faker.lorem.paragraph(),
                notes: faker.lorem.paragraph(),
                medicalId: medicalRecord.id
            }
        });

        // Create vital signs
        await prisma.vitalSigns.create({
            data: {
                encounterId: encounter.id,
                patientId: appointment.patientId,
                medicalId: medicalRecord.id,
                height: faker.number.float({ min: 50, max: 150, fractionDigits: 1 }),
                weight: faker.number.float({ min: 3, max: 50, fractionDigits: 1 }),
                temperature: faker.number.float({ min: 36.5, max: 38.5, fractionDigits: 1 }),
                systolic: faker.number.int({ min: 90, max: 120 }),
                diastolic: faker.number.int({ min: 60, max: 80 }),
                heartRate: faker.number.int({ min: 70, max: 130 }),
                respiratoryRate: faker.number.int({ min: 15, max: 30 }),
                oxygenSaturation: faker.number.int({ min: 95, max: 100 })
            }
        });

        // Create diagnosis
        await prisma.diagnosis.create({
            data: {
                patientId: appointment.patientId,
                medicalId: medicalRecord.id,
                doctorId: appointment.doctorId,
                symptoms: faker.lorem.words(5),
                diagnosis: faker.lorem.words(3),
                notes: faker.lorem.sentence(),
                prescribedMedications: faker.lorem.words(4),
                followUpPlan: faker.lorem.sentence()
            }
        });

        // Create prescription
        await prisma.prescription.create({
            data: {
                medicalRecordId: medicalRecord.id,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                enconterId: encounter.id,
                medicationName: faker.helpers.arrayElement(['Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Vitamin D']),
                dosage: faker.helpers.arrayElement(['250mg', '5ml', '1 tablet']),
                frequency: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Every 6 hours']),
                duration: faker.helpers.arrayElement(['7 days', '10 days', 'Until finished']),
                instructions: faker.lorem.sentence(),
                endDate: faker.date.soon({ days: 10 }),
                status: 'active'
            }
        });

        // Create lab test for some appointments
        if (faker.datatype.boolean(0.3)) {
            await prisma.labTest.create({
                data: {
                    recordId: medicalRecord.id,
                    testDate: appointment.appointmentDate,
                    result: faker.lorem.sentence(),
                    status: faker.helpers.arrayElement(['Completed', 'Pending', 'In Progress']),
                    notes: faker.lorem.sentence()
                }
            });
        }
    }
}

async function createBillingAndPayments(_patients: Patient[], appointments: Appointment[]) {
    console.log('💰 Creating billing and payments...');

    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED');

    for (const appointment of completedAppointments.slice(0, 40)) {
        const totalAmount = faker.number.float({ min: 100, max: 500, fractionDigits: 2 });
        const amountPaid = faker.number.float({ min: 0, max: totalAmount, fractionDigits: 2 });

        const payment = await prisma.payment.create({
            data: {
                patientId: appointment.patientId,
                appointmentId: appointment.id,
                billDate: appointment.appointmentDate,
                paymentDate: faker.date.soon({ days: 7 }),
                discount: faker.number.float({ min: 0, max: 50, fractionDigits: 2 }),
                totalAmount: totalAmount,
                amountPaid: amountPaid,
                paymentMethod: faker.helpers.arrayElement(['CASH', 'CARD', 'MOBILE']),
                status: amountPaid >= totalAmount ? 'PAID' : amountPaid > 0 ? 'PARTIAL' : 'UNPAID'
            }
        });

        // Create billing record
        await prisma.billing.create({
            data: {
                patientId: appointment.patientId,
                appointmentId: appointment.id,
                amount: totalAmount,
                status: amountPaid >= totalAmount ? 'PAID' : 'PENDING',
                insurance: faker.helpers.arrayElement(['None', 'Health Insurance Co.', 'Government']),
                serviceDate: appointment.appointmentDate,
                dueDate: faker.date.soon({ days: 30 }),
                paidDate: amountPaid >= totalAmount ? payment.paymentDate : null,
                notes: faker.lorem.sentence()
            }
        });
    }
}

async function createGrowthCharts(patients: Patient[]) {
    console.log('📊 Creating growth charts...');

    for (const patient of patients.slice(0, 30)) {
        const birthDate = patient.dateOfBirth;
        const currentAge = Math.floor((Date.now() - birthDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000));

        for (let i = 0; i <= currentAge; i += 3) {
            // Every 3 months
            if (i > 36) break; // Only up to 3 years for demo

            await prisma.growthChart.create({
                data: {
                    patientId: patient.id,
                    date: new Date(birthDate.getTime() + i * 30.44 * 24 * 60 * 60 * 1000),
                    age: i,
                    height: faker.number.float({ min: 45 + i * 1.5, max: 55 + i * 1.5, fractionDigits: 1 }),
                    weight: faker.number.float({ min: 3 + i * 0.3, max: 5 + i * 0.3, fractionDigits: 1 }),
                    headCircumference: faker.number.float({ min: 33 + i * 0.2, max: 38 + i * 0.2, fractionDigits: 1 }),
                    percentileHeight: faker.number.float({ min: 25, max: 75, fractionDigits: 1 }),
                    percentileWeight: faker.number.float({ min: 25, max: 75, fractionDigits: 1 }),
                    percentileHead: faker.number.float({ min: 25, max: 75, fractionDigits: 1 })
                }
            });
        }
    }
}

async function createImmunizations(patients: Patient[]) {
    console.log('💉 Creating immunizations...');

    const vaccines = ['BCG', 'Hepatitis B', 'Polio', 'DPT', 'MMR', 'Hepatitis A', 'Chickenpox'];

    for (const patient of patients.slice(0, 25)) {
        const birthDate = patient.dateOfBirth;

        for (let i = 0; i < 5; i++) {
            await prisma.immunization.create({
                data: {
                    patientId: patient.id,
                    vaccine: faker.helpers.arrayElement(vaccines),
                    date: new Date(birthDate.getTime() + i * 2 * 30.44 * 24 * 60 * 60 * 1000), // Every 2 months
                    dose: `Dose ${i + 1}`,
                    lotNumber: `LOT-${faker.string.numeric(6)}`,
                    notes: faker.lorem.sentence()
                }
            });
        }
    }
}

async function createFeedingLogs(patients: Patient[]) {
    console.log('🍼 Creating feeding logs...');

    for (const patient of patients.slice(0, 20)) {
        for (let i = 0; i < 10; i++) {
            await prisma.feedingLog.create({
                data: {
                    patientId: patient.id,
                    date: faker.date.recent({ days: 30 }),
                    type: faker.helpers.arrayElement(['BREAST', 'FORMULA', 'MIXED']),
                    duration: faker.number.int({ min: 10, max: 45 }),
                    amount: faker.number.float({ min: 30, max: 120, fractionDigits: 0 }),
                    breast: faker.helpers.arrayElement(['Left', 'Right', 'Both']),
                    notes: faker.lorem.sentence()
                }
            });
        }
    }
}

async function createNotifications(users: User[]) {
    console.log('🔔 Creating notifications...');

    for (let i = 0; i < 50; i++) {
        const user = faker.helpers.arrayElement(users);
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: faker.lorem.words(3),
                message: faker.lorem.sentence(),
                type: faker.helpers.arrayElement(['APPOINTMENT_REMINDER', 'BILLING', 'GENERAL', 'SECURITY']),
                read: faker.datatype.boolean()
            }
        });
    }
}

async function createWHOGrowthStandards() {
    console.log('📈 Creating WHO growth standards...');

    const measurementTypes = ['WFA', 'HFA', 'HcFA'];
    const genders = ['MALE', 'FEMALE'];

    for (const gender of genders) {
        for (const measurementType of measurementTypes) {
            for (let age = 0; age <= 36; age++) {
                // 0-36 months
                await prisma.wHOGrowthStandard.create({
                    data: {
                        ageInMonths: age,
                        gender: gender as Gender,
                        measurementType: measurementType as MeasurementType,
                        lValue: faker.number.float({ min: -2, max: 2, fractionDigits: 3 }),
                        mValue: faker.number.float({ min: 5, max: 15, fractionDigits: 3 }),
                        sValue: faker.number.float({ min: 0.1, max: 0.3, fractionDigits: 3 }),
                        sd0: faker.number.float({ min: 4, max: 16, fractionDigits: 2 }),
                        sd1neg: faker.number.float({ min: 3, max: 14, fractionDigits: 2 }),
                        sd1pos: faker.number.float({ min: 6, max: 18, fractionDigits: 2 }),
                        sd2neg: faker.number.float({ min: 2, max: 12, fractionDigits: 2 }),
                        sd2pos: faker.number.float({ min: 7, max: 20, fractionDigits: 2 }),
                        sd3neg: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
                        sd3pos: faker.number.float({ min: 8, max: 22, fractionDigits: 2 })
                    }
                });
            }
        }
    }
}

async function createTodos() {
    console.log('✅ Creating sample todos...');

    for (let i = 0; i < 10; i++) {
        await prisma.todo.create({
            data: {
                text: faker.lorem.sentence(),
                completed: faker.datatype.boolean()
            }
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
