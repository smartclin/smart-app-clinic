// no "use client" here
import { BriefcaseBusinessIcon, BriefcaseMedicalIcon, UserIcon, UsersIcon } from 'lucide-react';

import { AvailableDoctors } from '@/components/available-doctor';
import { AppointmentChart } from '@/components/charts/appointment-chart';
import { emptyAppointmentCounts, StatSummary } from '@/components/charts/stat-summary';
import { StatCard } from '@/components/stat-card';
import { RecentAppointments } from '@/components/tables/recent-appointment';
import { Button } from '@/components/ui/button';
import { api, HydrateClient } from '@/trpc/server';
import { AppointmentStatus, type AvailableDoctorProps, type PartialAppointment } from '@/types/data-types';

const AdminDashboard = async () => {
    // Use server caller instead of `trpc` proxy
    const dashboardData = await api.admin.getAdminDashboardStats();

    const {
        availableDoctors,
        last5Records,
        appointmentCounts,
        monthlyData,
        totalDoctors,
        totalPatient,
        totalAppointments
    } = dashboardData;

    // Map last5Records to PartialAppointment with proper typing
    const last5Mapped: PartialAppointment[] = (last5Records ?? []).map(a => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        time: a.time,
        status: (a.status as AppointmentStatus) || AppointmentStatus.PENDING,
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
            value: totalPatient ?? 0,
            icon: UsersIcon,
            className: 'bg-blue-600/15',
            iconClassName: 'bg-blue-600/25 text-blue-600',
            note: 'Total patients',
            link: '/manage-patients'
        },
        {
            title: 'Doctors',
            value: totalDoctors ?? 0,
            icon: UserIcon,
            className: 'bg-rose-600/15',
            iconClassName: 'bg-rose-600/25 text-rose-600',
            note: 'Total doctors',
            link: '/manage-doctors'
        },
        {
            title: 'Appointments',
            value: totalAppointments ?? 0,
            icon: BriefcaseBusinessIcon,
            className: 'bg-yellow-600/15',
            iconClassName: 'bg-yellow-600/25 text-yellow-600',
            note: 'Total appointments',
            link: '/manage-appointments'
        },
        {
            title: 'Consultation',
            value: appointmentCounts?.COMPLETED ?? 0,
            icon: BriefcaseMedicalIcon,
            className: 'bg-emerald-600/15',
            iconClassName: 'bg-emerald-600/25 text-emerald-600',
            note: 'Total consultation',
            link: '/manage-appointments'
        }
    ];

    return (
        <HydrateClient>
            <div className='flex flex-col gap-6 rounded-xl px-3 py-6 xl:flex-row'>
                {/* LEFT */}
                <div className='w-full xl:w-[69%]'>
                    <div className='mb-8 rounded-xl bg-white p-4'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h1 className='font-semibold text-lg'>Statistics</h1>
                            <Button
                                size='sm'
                                variant='outline'
                            >
                                {new Date().getFullYear()}
                            </Button>
                        </div>

                        <div className='flex w-full flex-wrap gap-5'>
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
                        <AppointmentChart data={monthlyData ?? []} />
                    </div>

                    <div className='mt-8 rounded-xl bg-white p-4'>
                        <RecentAppointments data={last5Mapped} />
                    </div>
                </div>

                {/* RIGHT */}
                <div className='w-full xl:w-[30%]'>
                    <div className='h-[450px] w-full'>
                        <StatSummary
                            data={appointmentCounts ?? emptyAppointmentCounts}
                            total={totalAppointments ?? 0}
                        />
                    </div>

                    <AvailableDoctors data={availableDoctors as AvailableDoctorProps} />
                </div>
            </div>
        </HydrateClient>
    );
};

export default AdminDashboard;
