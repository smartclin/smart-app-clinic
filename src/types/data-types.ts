import type { Gender } from '@prisma/client';
import type z from 'zod';

import type {
    AppointmentSchema,
    DiagnosisSchema,
    DoctorAuthSchema,
    DoctorSchema,
    PatientBillSchema,
    PatientFormSchema,
    PaymentSchema,
    ServicesSchema,
    StaffSchema,
    VitalSignsSchema,
    WorkingDaysSchema
} from '@/lib/schema';

export type AppointmentsChartProps = {
    name: string;
    appointment: number;
    completed: number;
}[];

export type Appointment = {
    id: number;
    patientId: string;
    doctorId: string;
    type: string;
    appointmentDate: Date;
    time: string;
    status: AppointmentStatus;

    patient: Patient;
    doctor: Doctor;
};

export type AvailableDoctorProps = {
    id: string;
    name: string;
    specialization: string;
    img?: string;
    colorCode?: string;
    workingDays: {
        day: string;
        startTime: string;
        closeTime: string;
    }[];
}[];

export type PartialPatient = {
    firstName: string;
    lastName: string;
    gender: string;
    img: string | null;
    colorCode: string | null;
};

export type PartialDoctor = {
    name: string;
    img: string | null;
    colorCode: string | null;
    specialization: string;
};

// Define the possible statuses for an appointment.
export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// Define the core data structure for a patient.
export type Patient = {
    firstName: string;
    lastName: string;
    image: string;
    gender: 'MALE' | 'FEMALE';
    colorCode: string; // A hex color code.
};

// Define the core data structure for a doctor.
export type Doctor = {
    name: string;
    specialization: string;
    img: string;
    colorCode: string; // A hex color code.
};

// Define the PartialAppointment type as expected by the component.
// It includes all the base properties plus the nested patient and doctor objects.
export type PartialAppointment = {
    appointmentDate: string | number | Date;
    time: string;
    status: AppointmentStatus | string;
    reason?: string | null;
    id: number;
    patient: {
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        gender: Gender;
        colorCode: string | null;
        img: string | null; // required
    };
    doctor: {
        id: string;
        name: string;
        specialization: string | null;
        colorCode: string | null;
        img: string | null;
    };
    // other fields
};

export type PatientInput = z.infer<typeof PatientFormSchema>;
export type StaffInput = z.infer<typeof StaffSchema>;
export type DoctorInput = z.infer<typeof DoctorSchema>;
export type ServiceInput = z.infer<typeof ServicesSchema>;
export type WorkScheduleInput = z.infer<typeof WorkingDaysSchema>;
export type AppointmentInput = z.infer<typeof AppointmentSchema>;
export type VitalSignsInput = z.infer<typeof VitalSignsSchema>;
export type DiagnosisInput = z.infer<typeof DiagnosisSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type PatientBillInput = z.infer<typeof PatientBillSchema>;
export type ServicesInput = z.infer<typeof ServicesSchema>;

// Resulting input type
export type DoctorAuthInput = z.infer<typeof DoctorAuthSchema>;

export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
