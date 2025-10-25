import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/server/api/root';

type MedicalRecordsRouterInput = inferRouterInputs<AppRouter>['medicalRecords'];
type MedicalRecordsRouterOutput = inferRouterOutputs<AppRouter>['medicalRecords'];

// ✅ Input type
export type GetMedicalRecordsInput = MedicalRecordsRouterInput['getMedicalRecords'];

// ✅ Output type
export type GetMedicalRecordsOutput = MedicalRecordsRouterOutput['getMedicalRecords'];
