'use client';

import { useEffect, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types
export type GrowthChartsProps = {
    patientData: {
        gender: 'MALE' | 'FEMALE';
        measurements: {
            ageInMonths: number;
            weight?: number;
            height?: number;
            bmi?: number;
        }[];
    };
    patientId: string; // add this
};

// Removed patientId as it was unused and causing a lint error
// patientId: string;

type WhoStandard = {
    ageInMonths: number;
    measurementType: string;
    sd0: number;
    sd1neg: number;
    sd1pos: number;
    sd2neg: number;
    sd2pos: number;
    sd3neg: number;
    sd3pos: number;
};

// Removed patientId from destructuring as it's no longer used
export function GrowthCharts({ patientData }: GrowthChartsProps) {
    const [whoData, setWhoData] = useState<WhoStandard[]>([]);

    // Fetch WHO standard data
    useEffect(() => {
        async function fetchWhoStandards() {
            const res = await fetch(`/api/who-standards?gender=${patientData.gender}&type=weight`);
            // FIX: Assert the type of data here
            const data = (await res.json()) as WhoStandard[];

            setWhoData(data);
        }
        fetchWhoStandards();
    }, [patientData.gender]);

    // Merge WHO standard + patient data
    const chartData = whoData.map(std => {
        const patientEntry = patientData.measurements.find(m => m.ageInMonths === std.ageInMonths);
        return {
            age: std.ageInMonths,
            SD0: std.sd0,
            SD1neg: std.sd1neg,
            SD1pos: std.sd1pos,
            SD2neg: std.sd2neg,
            SD2pos: std.sd2pos,
            SD3neg: std.sd3neg,
            SD3pos: std.sd3pos,
            patientWeight: patientEntry?.weight // No need for ?? null here if we filter later
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Growth Chart (Weight-for-Age)</CardTitle>
            </CardHeader>
            <CardContent className='h-96'>
                {chartData.length === 0 ? (
                    <p className='text-muted-foreground'>Loading growth data...</p>
                ) : (
                    <ResponsiveContainer
                        height='100%'
                        width='100%'
                    >
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis
                                dataKey='age'
                                label={{
                                    value: 'Age (months)',
                                    position: 'insideBottom',
                                    offset: -5
                                }}
                            />
                            <YAxis
                                label={{
                                    value: 'Weight (kg)',
                                    angle: -90,
                                    position: 'insideLeft'
                                }}
                            />
                            <Tooltip />
                            <Legend />

                            {/* WHO Standard Curves */}
                            <Line
                                dataKey='SD0'
                                dot={false}
                                name='Median'
                                stroke='#000'
                            />
                            <Line
                                dataKey='SD1neg'
                                dot={false}
                                name='-1 SD'
                                stroke='#ffa500'
                            />
                            <Line
                                dataKey='SD1pos'
                                dot={false}
                                name='+1 SD'
                                stroke='#ffa500'
                            />
                            <Line
                                dataKey='SD2neg'
                                dot={false}
                                name='-2 SD'
                                stroke='#ff0000'
                            />
                            <Line
                                dataKey='SD2pos'
                                dot={false}
                                name='+2 SD'
                                stroke='#ff0000'
                            />
                            <Line
                                dataKey='SD3neg'
                                dot={false}
                                name='-3 SD'
                                stroke='#800000'
                            />
                            <Line
                                dataKey='SD3pos'
                                dot={false}
                                name='+3 SD'
                                stroke='#800000'
                            />

                            {/* Patient Points */}
                            {chartData
                                .filter(d => d.patientWeight !== undefined && d.patientWeight !== null) // Refined filter
                                .map(d => (
                                    <ReferenceDot
                                        fill='#2e86de'
                                        key={d.SD0}
                                        label={{ value: 'Patient', position: 'top' }}
                                        r={5}
                                        stroke='white'
                                        x={d.age}
                                        y={d.patientWeight as number} // FIX 2: Assert patientWeight as number for ReferenceDot
                                    />
                                ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
