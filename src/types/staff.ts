import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/server/api/root';

type StaffRouterInput = inferRouterInputs<AppRouter>['staff'];
type StaffRouterOutput = inferRouterOutputs<AppRouter>['staff'];

// ✅ INPUT types
export type GetAllStaffInput = StaffRouterInput['getAllStaff'];

// ✅ OUTPUT types
export type GetAllStaffOutput = StaffRouterOutput['getAllStaff'];
