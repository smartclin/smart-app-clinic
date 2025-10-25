const MAGIC_NUMBER_1 = 7;
const MAGIC_NUMBER_5 = 2;

import { format } from 'date-fns';
import { z } from 'zod';

import { protectedProcedure, router } from '@/server/api/trpc';
import { db } from '@/server/db';

// Vital signs type
type VitalSignRecord = {
    createdAt: Date;
    systolic: number | null;
    diastolic: number | null;
    heartRate: number | null;
};

export const vitalSignsRouter = router({
    getVitalSignData: protectedProcedure
        .input(
            z.object({
                patientId: z.string().cuid() // validate patientId
            })
        )
        .query(async ({ input }) => {
            const { patientId } = input;

            // Calculate date range
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - MAGIC_NUMBER_1);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            // Query DB
            const data: VitalSignRecord[] = await db.vitalSigns.findMany({
                where: {
                    patientId,
                    createdAt: { gte: sevenDaysAgo }
                },
                select: {
                    createdAt: true,
                    systolic: true,
                    diastolic: true,
                    heartRate: true
                },
                orderBy: { createdAt: 'asc' }
            });

            if (!data || data.length === 0) {
                return {
                    data: [],
                    average: '0/0 mg/dL',
                    heartRateData: [],
                    averageHeartRate: '0-0 bpm'
                };
            }

            // Format BP data
            const formatVitals = data.map(record => ({
                label: format(new Date(record.createdAt), 'MMM d'),
                systolic: record.systolic,
                diastolic: record.diastolic
            }));

            // Format Heart Rate Data (treating as single numeric value, no range)
            const formattedHeartRateData = data.map(record => ({
                label: format(new Date(record.createdAt), 'MMM d'),
                value: record.heartRate ?? 0,
                systolic: record.systolic ?? 0,
                diastolic: record.diastolic ?? 0
            }));

            // Totals
            const totalSystolic = data.reduce((sum, rec) => sum + (rec.systolic ?? 0), 0);
            const totalDiastolic = data.reduce((sum, rec) => sum + (rec.diastolic ?? 0), 0);
            const totalHeartRate = data.reduce((sum, rec) => sum + (rec.heartRate ?? 0), 0);

            const count = data.length;

            // Averages
            const averageSystolic = totalSystolic / count;
            const averageDiastolic = totalDiastolic / count;
            const averageHeartRate = totalHeartRate / count;

            return {
                data: formatVitals,
                average: `${averageSystolic.toFixed(MAGIC_NUMBER_5)}/${averageDiastolic.toFixed(MAGIC_NUMBER_5)} mg/dL`,
                heartRateData: formattedHeartRateData,
                averageHeartRate: `${averageHeartRate.toFixed(MAGIC_NUMBER_5)} bpm`
            };
        })
});
