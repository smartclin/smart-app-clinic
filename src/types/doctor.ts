import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/server/api/root';

type DoctorRouterOutput = inferRouterOutputs<AppRouter>['doctor'];
type DoctorRouterInput = inferRouterInputs<AppRouter>['doctor'];

// ✅ Output Types
export type GetDoctorsOutput = DoctorRouterOutput['getDoctors'];
export type GetAllDoctorsOutput = DoctorRouterOutput['getAllDoctors'];
export type GetDoctorDashboardStatsOutput = DoctorRouterOutput['getDoctorDashboardStats'];
export type GetDoctorByIdOutput = DoctorRouterOutput['getDoctorById'];
export type GetAvailableDoctorsOutput = DoctorRouterOutput['getAvailableDoctors'];

// ✅ Optional: Input Types
export type GetAllDoctorsInput = DoctorRouterInput['getAllDoctors'];
export type GetDoctorByIdInput = DoctorRouterInput['getDoctorById'];
