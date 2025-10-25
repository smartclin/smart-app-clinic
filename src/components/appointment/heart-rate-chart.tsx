'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DataProps {
    average: string;
    data: {
        label: string;
        systolic: number;
        diastolic: number;
    }[];
}

export function HeartRateChart({ average, data }: DataProps) {
    const lastData = data[data.length - 1];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Heart Rate</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='mb-4 flex items-center justify-between'>
                    <div>
                        <p className='font-semibold text-lg xl:text-xl'>
                            {lastData?.systolic || 0}-{lastData?.diastolic || 0}
                        </p>
                        <p className='text-gray-500 text-sm'>Recent Reading</p>
                    </div>
                    <div>
                        <p className='font-semibold text-lg xl:text-xl'>{average}</p>
                        <p className='text-gray-500 text-sm'>Average Rate</p>
                    </div>
                    <Button
                        size='sm'
                        variant='outline'
                    >
                        See Insights
                    </Button>
                </div>

                <ResponsiveContainer
                    height={400}
                    width='100%'
                >
                    <LineChart data={data}>
                        <CartesianGrid
                            stroke='#ddd'
                            strokeDasharray='3 3'
                            vertical={false}
                        />
                        <XAxis
                            axisLine={false}
                            dataKey='label'
                            tick={{ fill: '#9ca3af' }}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={false}
                            tick={{ fill: '#9ca3af' }}
                            tickLine={false}
                        />
                        <Tooltip contentStyle={{ borderRadius: '10px', borderColor: '#fff' }} />
                        <Line
                            activeDot={{ r: 8 }}
                            dataKey='systolic'
                            stroke='#8884d8'
                            type='monotone'
                        />
                        <Line
                            dataKey='diastolic'
                            stroke='#82ca9d'
                            type='monotone'
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
