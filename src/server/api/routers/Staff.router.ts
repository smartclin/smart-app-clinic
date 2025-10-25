import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '@/server/api/trpc';
import { db } from '@/server/db';

const DEFAULT_LIMIT = 10;
const SUCCESS_STATUS_CODE = 200;

export const staffRouter = router({
    getAllStaff: publicProcedure
        .input(
            z.object({
                page: z.union([z.string(), z.number()]).default(1),
                limit: z.union([z.string(), z.number()]).optional(),
                search: z.string().optional()
            })
        )
        .query(async ({ input }) => {
            try {
                const PAGE_NUMBER = Number(input.page) <= 0 ? 1 : Number(input.page);
                const LIMIT = Number(input.limit) || DEFAULT_LIMIT;
                const SKIP = (PAGE_NUMBER - 1) * LIMIT;

                const whereClause = input.search
                    ? {
                          OR: [
                              { name: { contains: input.search, mode: Prisma.QueryMode.insensitive } },
                              { phone: { contains: input.search, mode: Prisma.QueryMode.insensitive } },
                              { email: { contains: input.search, mode: Prisma.QueryMode.insensitive } }
                          ]
                      }
                    : {};

                const [staff, totalRecords] = await Promise.all([
                    db.staff.findMany({
                        where: whereClause,
                        skip: SKIP,
                        take: LIMIT
                    }),
                    db.staff.count({
                        where: whereClause
                    })
                ]);

                const totalPages = Math.ceil(totalRecords / LIMIT);

                return {
                    success: true,
                    data: staff,
                    totalRecords,
                    totalPages,
                    currentPage: PAGE_NUMBER,
                    status: SUCCESS_STATUS_CODE
                };
            } catch (error) {
                console.error('❌ getAllStaff error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal Server Error',
                    cause: error
                });
            }
        })
});
