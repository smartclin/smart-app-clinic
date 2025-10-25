'use client';

import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type VitalSignsChartProps = {
    data: Array<{
        recordedAt: string | Date;
        bodyTemperature?: number;
        systolic?: number;
        diastolic?: number;
        heartRate?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
    }>;
};

export function VitalSignsChart({ data }: VitalSignsChartProps) {
    const [tab, setTab] = useState('temperature');

    // Normalize date to a short format
    const chartData = data.map(item => ({
        ...item,
        recordedAt: new Date(item.recordedAt).toLocaleDateString()
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vital Signs Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <p className='text-muted-foreground text-sm'>No vital signs recorded yet.</p>
                ) : (
                    <Tabs
                        className='w-full'
                        onValueChange={setTab}
                        value={tab}
                    >
                        <TabsList className='grid grid-cols-4'>
                            <TabsTrigger value='temperature'>Temp</TabsTrigger>
                            <TabsTrigger value='bp'>Blood Pressure</TabsTrigger>
                            <TabsTrigger value='hr'>Heart Rate</TabsTrigger>
                            <TabsTrigger value='spo2'>SpO₂</TabsTrigger>
                        </TabsList>

                        {/* Temperature */}
                        <TabsContent
                            className='h-72'
                            value='temperature'
                        >
                            <ResponsiveContainer
                                height='100%'
                                width='100%'
                            >
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='recordedAt' />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        dataKey='bodyTemperature'
                                        name='Body Temp (°C)'
                                        stroke='#ff7300'
                                        type='monotone'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </TabsContent>

                        {/* Blood Pressure */}
                        <TabsContent
                            className='h-72'
                            value='bp'
                        >
                            <ResponsiveContainer
                                height='100%'
                                width='100%'
                            >
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='recordedAt' />
                                    <YAxis
                                        label={{
                                            value: 'mmHg',
                                            angle: -90,
                                            position: 'insideLeft'
                                        }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        dataKey='systolic'
                                        name='Systolic'
                                        stroke='#8884d8'
                                        type='monotone'
                                    />
                                    <Line
                                        dataKey='diastolic'
                                        name='Diastolic'
                                        stroke='#82ca9d'
                                        type='monotone'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </TabsContent>

                        {/* Heart Rate */}
                        <TabsContent
                            className='h-72'
                            value='hr'
                        >
                            <ResponsiveContainer
                                height='100%'
                                width='100%'
                            >
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='recordedAt' />
                                    <YAxis label={{ value: 'bpm', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        dataKey='heartRate'
                                        name='Heart Rate'
                                        stroke='#ff0000'
                                        type='monotone'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </TabsContent>

                        {/* Oxygen Saturation */}
                        <TabsContent
                            className='h-72'
                            value='spo2'
                        >
                            <ResponsiveContainer
                                height='100%'
                                width='100%'
                            >
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='recordedAt' />
                                    <YAxis
                                        domain={[80, 100]}
                                        label={{ value: '%', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        dataKey='oxygenSaturation'
                                        name='SpO₂ (%)'
                                        stroke='#00bfff'
                                        type='monotone'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>
        </Card>
    );
}
