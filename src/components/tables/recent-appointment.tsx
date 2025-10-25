import { format } from 'date-fns';
import Link from 'next/link';

import { AppointmentStatus, type PartialAppointment } from '@/types/data-types';

import { AppointmentStatusIndicator } from '../appointment-status-indicator';
import { ProfileImage } from '../profile-image';
import { Button } from '../ui/button';
import { ViewAppointment } from '../view-appointment';
import { Table } from './table';

type DataProps = {
    data: PartialAppointment[];
};

const columns = [
    { header: 'Info', key: 'name' },
    { header: 'Date', key: 'appointmentDate', className: 'hidden md:table-cell' },
    { header: 'Time', key: 'time', className: 'hidden md:table-cell' },
    { header: 'Doctor', key: 'doctor', className: 'hidden md:table-cell' },
    { header: 'Status', key: 'status', className: 'hidden xl:table-cell' },
    { header: 'Actions', key: 'action' }
];

export const RecentAppointments = ({ data }: DataProps) => {
    const renderRow = (item: PartialAppointment) => {
        const name = `${item.patient?.firstName ?? 'N/A'} ${item.patient?.lastName ?? 'N/A'}`;
        const patientImage = item.patient.img ?? '';
        const patientColorCode = item.patient?.colorCode ?? '#000000';
        const patientGender = item.patient?.gender ?? 'N/A';

        const doctorName = item.doctor?.name ?? 'N/A';
        const doctorSpecialization = item.doctor?.specialization ?? 'N/A';
        const doctorColorCode = item.doctor?.colorCode ?? '#000000';
        const doctorImage = item.doctor?.img ?? '';

        // Type-safe status
        const appointmentStatus: AppointmentStatus = Object.values(AppointmentStatus).includes(
            item.status as AppointmentStatus
        )
            ? (item.status as AppointmentStatus)
            : AppointmentStatus.PENDING;

        const appointmentDate = item.appointmentDate ? new Date(item.appointmentDate) : new Date();
        const appointmentTime = item.time ?? 'N/A';

        return (
            <tr
                className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
                key={item.id}
            >
                <td className='flex items-center gap-2 py-2 xl:py-4 2xl:gap-4'>
                    <ProfileImage
                        bgColor={patientColorCode}
                        name={name}
                        url={patientImage}
                    />
                    <div>
                        <h3 className='text-sm uppercase md:font-medium md:text-base'>{name}</h3>
                        <span className='text-xs capitalize'>{patientGender.toLowerCase()}</span>
                    </div>
                </td>

                <td className='hidden md:table-cell'>{format(appointmentDate, 'yyyy-MM-dd')}</td>
                <td className='hidden md:table-cell'>{appointmentTime}</td>

                <td className='hidden items-center py-2 md:table-cell'>
                    <div className='flex items-center gap-2 2xl:gap-4'>
                        <ProfileImage
                            bgColor={doctorColorCode}
                            name={doctorName}
                            textClassName='text-black font-medium'
                            url={doctorImage}
                        />
                        <div>
                            <h3 className='font-medium uppercase'>{doctorName}</h3>
                            <span className='text-xs capitalize'>{doctorSpecialization}</span>
                        </div>
                    </div>
                </td>

                <td className='hidden xl:table-cell'>
                    <AppointmentStatusIndicator status={appointmentStatus} />
                </td>

                <td>
                    <div className='flex items-center gap-x-2'>
                        <ViewAppointment id={item.id} />
                        <Button
                            asChild
                            variant='outline'
                        >
                            <Link href={`/record/appointments/${item.id}`}>See all</Link>
                        </Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className='rounded-xl bg-white p-2 2xl:p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg'>Recent Appointments</h1>
                <Button
                    asChild
                    variant='outline'
                >
                    <Link href='/record/appointments'>View All</Link>
                </Button>
            </div>
            <Table
                columns={columns}
                data={data}
                renderRow={renderRow}
            />
        </div>
    );
};
