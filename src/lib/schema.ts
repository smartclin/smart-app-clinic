const MAGIC_2_0 = 2;
const MAGIC_30_1 = 30;
const MAGIC_50_2 = 50;
const MAGIC_10_3 = 10;
const MAGIC_5_4 = 5;
const MAGIC_500_5 = 500;
const MAGIC_8_6 = 8;
const MAGIC_6_7 = 6;

import { z } from 'zod';

export const PatientFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(MAGIC_2_0, 'First name must be at least MAGIC_2_0 characters')
        .max(MAGIC_30_1, "First name can't be more than MAGIC_50_2 characters"),
    lastName: z
        .string()
        .trim()
        .min(MAGIC_2_0, 'dLast name must be at least MAGIC_2_0 characters')
        .max(MAGIC_30_1, "First name can't be more than MAGIC_50_2 characters"),
    dateOfBirth: z.coerce.date(),
    gender: z.enum(['MALE', 'FEMALE'], {
        error: 'Gender is required'
    }),

    phone: z.string().min(MAGIC_10_3, 'Enter phone number').max(MAGIC_10_3, 'Enter phone number'),
    email: z.email('Invalid email address.'),
    address: z
        .string()
        .min(MAGIC_5_4, 'Address must be at least MAGIC_5_4 characters')
        .max(MAGIC_500_5, 'Address must be at most MAGIC_500_5 characters'),
    nutritionalStatus: z.enum(['normal', 'wasted', 'stunted', 'malnourished', 'obese'], {
        error: 'Nutritional status is required.'
    }),
    emergencyContactName: z
        .string()
        .min(MAGIC_2_0, 'Emergency contact name is required.')
        .max(MAGIC_50_2, 'Emergency contact must be at most MAGIC_50_2 characters'),
    emergencyContactNumber: z.string().min(MAGIC_10_3, 'Enter phone number').max(MAGIC_10_3, 'Enter phone number'),
    relation: z.enum(['mother', 'father', 'husband', 'wife', 'other'], {
        error: 'Relations with contact person required'
    }),
    bloodGroup: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    medicalHistory: z.string().optional(),
    image: z.string().optional()
});

export const AppointmentSchema = z.object({
    doctorId: z.string().min(1, 'Select physician'),
    patientId: z.string().min(1, 'Select patient'),
    type: z.string().min(1, 'Select type of appointment'),
    appointmentDate: z.string().min(1, 'Select appointment date'),
    time: z.string().min(1, 'Select appointment time'),
    note: z.string().optional()
});

export const DoctorSchema = z.object({
    name: z
        .string()
        .trim()
        .min(MAGIC_2_0, 'Name must be at least MAGIC_2_0 characters')
        .max(MAGIC_50_2, 'Name must be at most MAGIC_50_2 characters'),
    phone: z.string().min(MAGIC_10_3, 'Enter phone number').max(MAGIC_10_3, 'Enter phone number'),
    email: z.email('Invalid email address.'),
    address: z
        .string()
        .min(MAGIC_5_4, 'Address must be at least MAGIC_5_4 characters')
        .max(MAGIC_500_5, 'Address must be at most MAGIC_500_5 characters'),
    specialization: z.string().min(MAGIC_2_0, 'Specialization is required.'),
    licenseNumber: z.string().min(MAGIC_2_0, 'License number is required'),
    type: z.enum(['FULL', 'PART'], {
        error: 'Type is required.'
    }),
    department: z.string().min(MAGIC_2_0, 'Department is required.'),
    img: z.string().optional(),
    password: z
        .string()
        .min(MAGIC_8_6, {
            error: 'Password must be at least MAGIC_8_6 characters long!'
        })
        .optional()
        .or(z.literal(''))
});

export const workingDaySchema = z.object({
    day: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
    startTime: z.string(),
    closeTime: z.string()
});
export type Day = z.infer<typeof workingDaySchema>;
export const StaffSchema = z.object({
    name: z
        .string()
        .trim()
        .min(MAGIC_2_0, 'Name must be at least MAGIC_2_0 characters')
        .max(MAGIC_50_2, 'Name must be at most MAGIC_50_2 characters'),
    role: z.enum(['STAFF'], {
        error: 'Role is required.'
    }),
    phone: z
        .string()
        .min(MAGIC_10_3, 'Contact must be MAGIC_10_3-digits')
        .max(MAGIC_10_3, 'Contact must be MAGIC_10_3-digits'),
    email: z.email('Invalid email address.'),
    address: z
        .string()
        .min(MAGIC_5_4, 'Address must be at least MAGIC_5_4 characters')
        .max(MAGIC_500_5, 'Address must be at most MAGIC_500_5 characters'),
    licenseNumber: z.string().optional(),
    department: z.string().optional(),
    img: z.string().optional(),
    password: z
        .string()
        .min(MAGIC_8_6, {
            error: 'Password must be at least MAGIC_8_6 characters long!'
        })

        .or(z.literal(''))
});
export const StaffAuthSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    department: z.string().optional(),
    img: z.string().optional(),
    licenseNumber: z.string().optional(),
    colorCode: z.string().optional(),
    hireDate: z.date().optional(),
    salary: z.number().optional(),
    role: z.enum(['ADMIN', 'DOCTOR', 'STAFF', 'PATIENT']),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DORMANT']).optional(),
    password: z.string().min(MAGIC_6_7, 'Password should be at least MAGIC_6_7 characters long')
});

// Refined Success Response
export const CreateStaffSuccessResponse = z.object({
    success: z.literal(true), // This means 'success' must be true
    msg: z.string(),
    message: z.string().optional(), // Server might sometimes send 'message' even on success
    errors: z.boolean().optional(), // Account for 'errors' if it might be present
    error: z.boolean().optional() // Account for 'error' if it might be present
});

// Refined Error Response
export const CreateStaffErrorResponse = z.object({
    success: z.literal(false), // This means 'success' must be false
    message: z.string(),
    msg: z.string().optional(), // Server might sometimes send 'msg' even on error
    errors: z.boolean().optional(), // Account for 'errors' if it might be present
    error: z.boolean().optional() // Account for 'error' if it might be present
});

// Union of all possible outcomes
export const CreateStaffOutputSchema = z.union([
    CreateStaffSuccessResponse,
    CreateStaffErrorResponse,
    // If there's another "error" shape from the server (e.g., from auth.api.createUser direct error), add it here
    // For example, an object that might come directly from auth.api.createUser:
    z.object({
        success: z.boolean(), // Here, success might be a plain boolean
        message: z.string(),
        errors: z.boolean().optional(),
        error: z.boolean().optional(),
        msg: z.string().optional()
    })
]);

export const VitalSignsSchema = z.object({
    patientId: z.string(),
    medicalId: z.number(),
    encounterId: z.string().optional(),

    height: z.number().optional(), // Float?
    weight: z.number().optional(), // Float?
    temperature: z.number().optional(), // Float?
    systolic: z.number().optional(), // Int?
    diastolic: z.number().optional(), // Int?
    heartRate: z.number().optional(), // Int?
    respiratoryRate: z.number().optional(), // Int?
    oxygenSaturation: z.number().optional(), // Int?

    recordedAt: z.date() // default(now()) in Prisma
});

export type VitalSignsFormData = z.infer<typeof VitalSignsSchema>;

export const EncounterSchema = z.object({
    patientId: z.string(),
    doctorId: z.string(),
    type: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    notes: z.string().optional(),
    medicalId: z.number(),
    date: z.date().optional() // defaults to now
});

export type EncounterFormData = z.infer<typeof EncounterSchema>;
export const DiagnosisSchema = z.object({
    patientId: z.string(),
    medicalId: z.number(),
    doctorId: z.string(),
    symptoms: z.string({
        error: 'Symptoms required'
    }),
    diagnosis: z.string({
        error: 'Diagnosis required'
    }),
    notes: z.string().optional(),
    prescribedMedications: z.string().optional(),
    followUpPlan: z.string().optional()
});

export const PaymentSchema = z.object({
    id: z.number(),
    billDate: z.date(),
    discount: z.number(),
    totalAmount: z.number()
});

export type PaymentInput = z.infer<typeof PaymentSchema>;

export const PatientBillSchema = z.object({
    billId: z.number(),
    serviceId: z.number(),
    serviceDate: z.string(),
    appointmentId: z.number(),
    quantity: z.string({
        error: 'Quantity is required'
    }),
    unitCost: z.string({
        error: 'Unit cost is required'
    }),
    totalCost: z.string({
        error: 'Total cost is required'
    })
});

export const ServicesSchema = z.object({
    serviceName: z.string({
        error: 'Service name is required'
    }),
    price: z.number({
        error: 'Service price is required'
    }),
    description: z.string({
        error: 'Service description is required'
    })
});

export const PrescriptionSchema = z.object({
    // Align with Prisma model `Prescription`
    medicalRecordId: z.number().int().positive(),
    doctorId: z.string().min(1, 'Doctor ID is required').optional(),
    patientId: z.string().min(1, 'Patient ID is required'),

    medicationName: z.string().min(1, 'Medication name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    duration: z.string().min(1, 'Duration is required'),
    instructions: z.string().optional().nullable(),
    issuedDate: z.coerce.date().default(() => new Date()),
    endDate: z.coerce.date().optional().nullable(),
    status: z.string().default('active')
});

export const VaccinationSchema = z.object({
    // id will be auto-generated by Drizzle
    administeredBy: z.string().min(1, 'Administering staff ID is required').optional().nullable(), // Nullable in Drizzle
    administeredDate: z.coerce.date().refine(date => date <= new Date(), {
        // Administered date cannot be in the future
        error: 'Administered date cannot be in the future'
    }),
    nextDueDate: z.coerce.date().optional().nullable(), // Nullable
    notes: z.string().optional().nullable(), // Nullable
    patientId: z.string().min(1, 'Patient ID is required'),
    vaccineName: z.string().min(1, 'Vaccine name is required')
    // createdAt and updatedAt are handled by Drizzle timestamps
});

export const WHOGrowthStandardSchema = z.object({
    // Align with Prisma model `WHOGrowthStandard`
    ageInMonths: z.number().int().min(0, 'Age in months cannot be negative'),
    gender: z.enum(['MALE', 'FEMALE']),
    measurementType: z.enum(['WFA', 'HFA', 'HcFA']),
    lValue: z.number(),
    mValue: z.number(),
    sValue: z.number(),
    sd0: z.number(),
    sd1neg: z.number(),
    sd1pos: z.number(),
    sd2neg: z.number(),
    sd2pos: z.number(),
    sd3neg: z.number(),
    sd3pos: z.number(),
    sd4neg: z.number().optional().nullable(),
    sd4pos: z.number().optional().nullable()
});

export const whoGrowthQuerySchema = z.object({
    gender: z.enum(['MALE', 'FEMALE']),
    measurementType: z.enum(['WFA', 'HFA', 'HcFA'])
});

export type WhoGrowthQuery = z.infer<typeof whoGrowthQuerySchema>;

export const PatientCreateInputSchema = z.object({
    pid: z.string(), // This 'pid' will be the "new-patient" string or an existing ID
    data: PatientFormSchema // The actual form data for the patient
});

// Schema for updating an existing patient
export const PatientUpdateInputSchema = z.object({
    pid: z.string(), // The ID of the patient to update (required)
    data: PatientFormSchema.partial() // The data to update, making fields optional for partial updates
});

export const DoctorAuthSchema = DoctorSchema.extend({
    password: z.string().min(MAGIC_6_7, 'Password should be at least MAGIC_6_7 characters long')
});

// Define a common success message output schema
export const SuccessOutputSchema = z.object({
    msg: z.string()
});

export const reviewSchema = z.object({
    patientId: z.string(),
    staffId: z.string(),
    rating: z.number().min(1).max(MAGIC_5_4),
    comment: z
        .string()
        .min(1, 'Review must be at least MAGIC_10_3 characters long')
        .max(MAGIC_500_5, 'Review must not exceed MAGIC_500_5 characters')
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
export type DiagnosisFormData = z.infer<typeof DiagnosisSchema>;
export const AddNewBillInputSchema = PatientBillSchema.extend({
    appointmentId: z.number().int().positive().optional(),
    billId: z
        .union([z.number(), z.null(), z.undefined()])
        .optional()
        .transform(val => (val === 0 ? undefined : val))
});
export const WorkingDaysSchema = z.object({
    day: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
    startTime: z.string(),
    closeTime: z.string()
});
