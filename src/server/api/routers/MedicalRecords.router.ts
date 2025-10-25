import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { publicProcedure, router } from '@/server/api/trpc'; // adjust path as needed
import { db } from '@/server/db';

const MAGIC_NUMBER_1 = 10;
const MAGIC_NUMBER_2 = 200;
const MAGIC_NUMBER_3 = 500;
// Input schema for pagination and search

export const medicalRecordsRouter = router({
    getMedicalRecords: publicProcedure
        .input(
            z.object({
                page: z.union([z.number(), z.string()]),
                limit: z.union([z.number(), z.string()]).optional(),
                search: z.string().optional()
            })
        )
        .query(async ({ input }) => {
            try {
                const PAGE_NUMBER = Number(input.page) <= 0 ? 1 : Number(input.page);
                const LIMIT = Number(input.limit) || MAGIC_NUMBER_1;
                const SKIP = (PAGE_NUMBER - 1) * LIMIT;

                const where: Prisma.MedicalRecordsWhereInput = input.search
                    ? {
                          OR: [
                              {
                                  patient: {
                                      firstName: {
                                          contains: input.search,
                                          mode: 'insensitive'
                                      }
                                  }
                              },
                              {
                                  patient: {
                                      lastName: {
                                          contains: input.search,
                                          mode: 'insensitive'
                                      }
                                  }
                              },
                              {
                                  patientId: {
                                      contains: input.search,
                                      mode: 'insensitive'
                                  }
                              }
                          ]
                      }
                    : {};

                const [data, totalRecords] = await Promise.all([
                    db.medicalRecords.findMany({
                        where,
                        include: {
                            patient: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    dateOfBirth: true,
                                    image: true,
                                    colorCode: true,
                                    gender: true
                                }
                            },
                            diagnosis: {
                                include: {
                                    doctor: {
                                        select: {
                                            name: true,
                                            specialization: true,
                                            img: true,
                                            colorCode: true
                                        }
                                    }
                                }
                            },
                            labTest: true
                        },
                        skip: SKIP,
                        take: LIMIT,
                        orderBy: { createdAt: 'desc' }
                    }),
                    db.medicalRecords.count({ where })
                ]);

                const totalPages = Math.ceil(totalRecords / LIMIT);

                return {
                    success: true,
                    data,
                    totalRecords,
                    totalPages,
                    currentPage: PAGE_NUMBER,
                    status: MAGIC_NUMBER_2
                };
            } catch (error) {
                console.error(error);
                return {
                    success: false,
                    message: 'Internal Server Error',
                    status: MAGIC_NUMBER_3
                };
            }
        })
});
