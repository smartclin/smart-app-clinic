import { AppointmentStatus } from '@prisma/client';
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from 'lucide-react';
import Link from 'next/link';

import { AvailableDoctors } from '@/components/available-doctor';
import { AppointmentChart } from '@/components/charts/appointment-chart';
import { emptyAppointmentCounts, StatSummary } from '@/components/charts/stat-summary';
import { StatCard } from '@/components/stat-card';
import { RecentAppointments } from '@/components/tables/recent-appointment';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth-server';
import { api, HydrateClient } from '@/trpc/server';
import type { AvailableDoctorProps, PartialAppointment } from '@/types/data-types';

const DoctorDashboard = async () => {
    const session = await getSession();
    const user = session?.user;
    if (!user) return null;

    const [availableDoctorsRaw, dashboardStats] = await Promise.all([
        api.doctor.getAvailableDoctors(),
        api.doctor.getDoctorDashboardStats()
    ]);

    const availableDoctors: AvailableDoctorProps = (availableDoctorsRaw?.data ?? []).map(doc => ({
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        img: doc.img ?? '/default-avatar.png',
        colorCode: doc.colorCode ?? '#000000',
        workingDays:
            doc.workingDays?.map(day => ({
                day: day.day,
                startTime: day.startTime,
                closeTime: day.closeTime
            })) ?? []
    }));

    const normalizedAppointments: PartialAppointment[] = (dashboardStats.last5Records ?? []).map(a => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        time: a.time,
        status: a.status ?? AppointmentStatus.PENDING,
        reason: a.reason ?? null,
        patient: {
            id: a.patientId,
            firstName: a.patient?.firstName ?? 'N/A',
            lastName: a.patient?.lastName ?? 'N/A',
            img: a.patient?.image ?? '/default-avatar.png',
            colorCode: a.patient?.colorCode ?? '#000000',
            gender: a.patient?.gender ?? 'N/A',
            dateOfBirth: a.patient?.dateOfBirth ?? new Date()
        },
        doctor: {
            id: a.doctorId,
            name: a.doctor?.name ?? 'N/A',
            specialization: a.doctor?.specialization ?? 'N/A',
            img: a.doctor?.img ?? '/default-avatar.png',
            colorCode: a.doctor?.colorCode ?? '#000000'
        },
        img: a.patient?.image ?? '/default-avatar.png'
    }));

    const cardData = [
        {
            title: 'Patients',
            value: dashboardStats.totalPatient ?? 0,
            icon: Users,
            className: 'bg-blue-600/15',
            iconClassName: 'bg-blue-600/25 text-blue-600',
            note: 'Total patients',
            link: '/record/patients'
        },
        {
            title: 'Nurses',
            value: dashboardStats.totalNurses ?? 0,
            icon: User,
            className: 'bg-rose-600/15',
            iconClassName: 'bg-rose-600/25 text-rose-600',
            note: 'Total nurses',
            link: ''
        },
        {
            title: 'Appointments',
            value: dashboardStats.totalAppointment ?? 0,
            icon: BriefcaseBusiness,
            className: 'bg-yellow-600/15',
            iconClassName: 'bg-yellow-600/25 text-yellow-600',
            note: 'Total appointments',
            link: '/record/appointments'
        },
        {
            title: 'Consultation',
            value: dashboardStats.appointmentCounts?.COMPLETED ?? 0,
            icon: BriefcaseMedical,
            className: 'bg-emerald-600/15',
            iconClassName: 'bg-emerald-600/25 text-emerald-600',
            note: 'Total consultation',
            link: '/record/appointments'
        }
    ];

    return (
        <HydrateClient>
            <div className='flex flex-col gap-6 rounded-xl px-3 py-6 xl:flex-row'>
                {/* LEFT */}
                <div className='w-full xl:w-[69%]'>
                    <div className='mb-8 rounded-xl bg-white p-4'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h1 className='font-semibold text-lg xl:text-2xl'>Welcome, Dr. {user.name}</h1>
                            <Button
                                asChild
                                size='sm'
                                variant='outline'
                            >
                                <Link href={`/record/doctors/${user.id}`}>View profile</Link>
                            </Button>
                        </div>

                        <div className='flex w-full flex-wrap gap-2'>
                            {cardData.map(el => (
                                <StatCard
                                    className={el.className}
                                    icon={el.icon}
                                    iconClassName={el.iconClassName}
                                    key={el.title}
                                    link={el.link}
                                    note={el.note}
                                    title={el.title}
                                    value={el.value}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='h-[500px]'>
                        <AppointmentChart data={dashboardStats.monthlyData ?? []} />
                    </div>

                    <div className='mt-8 rounded-xl bg-white p-4'>
                        <RecentAppointments data={normalizedAppointments} />
                    </div>
                </div>

                {/* RIGHT */}
                <div className='w-full xl:w-[30%]'>
                    <div className='h-[450px] w-full'>
                        <StatSummary
                            data={dashboardStats.appointmentCounts ?? emptyAppointmentCounts}
                            total={dashboardStats.totalAppointment ?? 0}
                        />
                    </div>

                    <AvailableDoctors data={availableDoctors} />
                </div>
            </div>
        </HydrateClient>
    );
};

export default DoctorDashboard;
