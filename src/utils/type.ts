import { Temporal } from '@js-temporal/polyfill';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';

import type { AppRouter } from '@/server/api/root';

export function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
}

export function getUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? '';
}

superjson.registerCustom(
    {
        isApplicable: (v): v is Temporal.PlainDate => v instanceof Temporal.PlainDate,
        serialize: v => v.toJSON(),
        deserialize: v => Temporal.PlainDate.from(v)
    },
    'Temporal.PlainDate'
);

superjson.registerCustom(
    {
        isApplicable: (v): v is Temporal.PlainDateTime => v instanceof Temporal.PlainDateTime,
        serialize: v => v.toJSON(),
        deserialize: v => Temporal.PlainDateTime.from(v)
    },
    'Temporal.PlainDateTime'
);

export const transformer = superjson;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Example: type-safe sub-router inputs/outputs
export type AdminInputs = RouterInputs['admin'];
export type AdminOutputs = RouterOutputs['admin'];

export type AppointmentInputs = RouterInputs['appointment'];
export type AppointmentOutputs = RouterOutputs['appointment'];

export type AuthInputs = RouterInputs['auth'];
export type AuthOutputs = RouterOutputs['auth'];

export type DoctorInputs = RouterInputs['doctor'];
export type DoctorOutputs = RouterOutputs['doctor'];

export type MedicalRecordsInputs = RouterInputs['medicalRecords'];
export type MedicalRecordsOutputs = RouterOutputs['medicalRecords'];

export type PatientInputs = RouterInputs['patient'];
export type PatientOutputs = RouterOutputs['patient'];

export type PaymentInputs = RouterInputs['payment'];
export type PaymentOutputs = RouterOutputs['payment'];

export type StaffInputs = RouterInputs['staff'];
export type StaffOutputs = RouterOutputs['staff'];

export type VitalSignsInputs = RouterInputs['vitalSigns'];
export type VitalSignsOutputs = RouterOutputs['vitalSigns'];
