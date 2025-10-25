import { Gender } from '@prisma/client';
import { BriefcaseBusinessIcon, BriefcaseIcon, BriefcaseMedicalIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AvailableDoctors } from '@/components/available-doctor';
import { AppointmentChart } from '@/components/charts/appointment-chart';
import { emptyAppointmentCounts, StatSummary } from '@/components/charts/stat-summary';
import { StatCard } from '@/components/stat-card';
import { RecentAppointments } from '@/components/tables/recent-appointment';
import { Button } from '@/components/ui/button';
import { getSession } from '@/server/auth/utils';
import { api, HydrateClient } from '@/trpc/server';
import { AppointmentStatus, type AvailableDoctorProps, type PartialAppointment } from '@/types/data-types';

const PatientDashboard = async () => {
    const session = await getSession();
    const user = session?.user;
    if (!user?.id) redirect('/signin');
    const { data, appointmentCounts, last5Records, totalAppointments, availableDoctor, monthlyData } =
        await api.patient.getPatientDashboardStatistics(user.id);

    if (!data) redirect('/patient/registration');

    // Mapped last5Records to PartialAppointment to ensure data consistency
    const last5Mapped: PartialAppointment[] = (last5Records ?? []).map(a => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        time: a.time,
        status: (a.status as AppointmentStatus) || AppointmentStatus.PENDING,
        reason: a.reason ?? null,
        patient: {
            // These properties are not in the raw data, so we provide fallbacks
            id: a.patientId,
            firstName: 'N/A',
            lastName: 'N/A',
            img: '/default-avatar.png',
            colorCode: '#000000',
            gender: Gender.MALE,
            dateOfBirth: new Date()
        },
        doctor: {
            // These properties are not in the raw data, so we provide fallbacks
            id: a.doctorId,
            name: 'N/A',
            specialization: 'N/A',
            img: '/default-avatar.png',
            colorCode: '#000000'
        },
        img: '/default-avatar.png'
    }));

    const cardData = [
        {
            title: 'appointments',
            value: totalAppointments,
            icon: BriefcaseIcon,
            className: 'bg-blue-600/15',
            iconClassName: 'bg-blue-600/25 text-blue-600',
            note: 'Total appointments',
            link: '/record/appointments'
        },
        {
            title: 'cancelled',
            value: appointmentCounts?.CANCELLED,
            icon: BriefcaseIcon,
            className: 'bg-rose-600/15',
            iconClassName: 'bg-rose-600/25 text-rose-600',
            note: 'Cancelled Appointments',
            link: '/record/appointments?status=CANCELLED'
        },
        {
            title: 'pending',
            value: (appointmentCounts?.PENDING ?? 0) + (appointmentCounts?.SCHEDULED ?? 0),
            icon: BriefcaseBusinessIcon,
            className: 'bg-yellow-600/15',
            iconClassName: 'bg-yellow-600/25 text-yellow-600',
            note: 'Pending Appointments',
            link: '/record/appointments?status=PENDING'
        },
        {
            title: 'completed',
            value: appointmentCounts?.COMPLETED,
            icon: BriefcaseMedicalIcon,
            className: 'bg-emerald-600/15',
            iconClassName: 'bg-emerald-600/25 text-emerald-600',
            note: 'Successfully appointments',
            link: '/record/appointments?status=COMPLETED'
        }
    ];

    return (
        <HydrateClient>
            <div className='flex flex-col gap-6 rounded-xl px-3 py-6 xl:flex-row'>
                {/* LEFT */}
                <div className='w-full xl:w-[69%]'>
                    <div className='mb-8 rounded-xl bg-white p-4'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h1 className='font-semibold text-lg xl:text-2xl'>
                                Welcome {data?.firstName || user.name}
                            </h1>
                            <div className='space-x-2'>
                                <Button size='sm'>{new Date().getFullYear()}</Button>
                                <Button
                                    className='hover:underline'
                                    size='sm'
                                    variant='outline'
                                >
                                    <Link href='/patient/self'>View Profile</Link>
                                </Button>
                            </div>
                        </div>
                        <div className='flex w-full flex-wrap gap-5'>
                            {cardData.map(el => (
                                <StatCard
                                    key={el.title}
                                    {...el}
                                    link={el.link}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='h-[500px]'>
                        <AppointmentChart data={monthlyData ?? []} />
                    </div>
                    <div className='mt-8 rounded-xl bg-white p-4'>
                        <RecentAppointments data={last5Mapped} />
                    </div>
                </div>
                {/* RIGHT */}
                <div className='w-full xl:w-[30%]'>
                    <div className='mb-8 h-[450px] w-full'>
                        <StatSummary
                            data={appointmentCounts ?? emptyAppointmentCounts}
                            total={totalAppointments ?? 0}
                        />
                    </div>
                    <AvailableDoctors data={availableDoctor as AvailableDoctorProps} />
                </div>
            </div>
        </HydrateClient>
    );
};

export default PatientDashboard;
