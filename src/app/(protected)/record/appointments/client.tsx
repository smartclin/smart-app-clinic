'use client';

import { format } from 'date-fns';
import { BriefcaseBusinessIcon } from 'lucide-react';

import { AppointmentActionOptions } from '@/components/appointment-actions';
import { AppointmentContainer } from '@/components/appointment-container';
import { AppointmentStatusIndicator } from '@/components/appointment-status-indicator';
import { Pagination } from '@/components/pagination';
import { ProfileImage } from '@/components/profile-image';
import SearchInput from '@/components/search-input';
import { Table } from '@/components/tables/table';
import { ViewAppointment } from '@/components/view-appointment';
import { type AppointmentStatus, AppointmentStatus as LocalAppointmentStatus } from '@/types/data-types';
import { DATA_LIMIT } from '@/utils/seetings';

export type AppointmentItem = {
    id: number;
    patientId: string | null;
    doctorId: string | null;
    type: string | null;
    appointmentDate: Date | null;
    time: string | null;
    status: AppointmentStatus;
    patient: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        gender: string;
        img: string | null;
        dateOfBirth: Date | null;
        colorCode: string | null;
    } | null;
    doctor: {
        id: string;
        name: string;
        specialization: string | null;
        colorCode: string | null;
        img: string | null;
    } | null;
};

type Props = {
    data: AppointmentItem[];
    totalPages: number;
    totalRecord: number;
    currentPage: number;
    userId?: string;
    isPatient: boolean;
};

const mapStatus = (status: AppointmentStatus | undefined): LocalAppointmentStatus => {
    switch (status) {
        case 'PENDING':
            return LocalAppointmentStatus.PENDING;
        case 'SCHEDULED':
            return LocalAppointmentStatus.SCHEDULED;
        case 'COMPLETED':
            return LocalAppointmentStatus.COMPLETED;
        case 'CANCELLED':
            return LocalAppointmentStatus.CANCELLED;
        default:
            return LocalAppointmentStatus.PENDING;
    }
};

export default function AppointmentsClient({ data, totalPages, totalRecord, currentPage, userId, isPatient }: Props) {
    const columns = [
        { header: 'Info', key: 'name' },
        { header: 'Date', key: 'appointment_date', className: 'hidden md:table-cell' },
        { header: 'Time', key: 'time', className: 'hidden md:table-cell' },
        { header: 'Doctor', key: 'doctor', className: 'hidden md:table-cell' },
        { header: 'Status', key: 'status', className: 'hidden xl:table-cell' },
        { header: 'Actions', key: 'action' }
    ];

    const renderItem = (item: AppointmentItem) => {
        const patientName = item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : 'N/A';
        return (
            <tr
                className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
                key={item.id}
            >
                <td className='flex items-center gap-2 py-2 md:gap-4 xl:py-4'>
                    {item.patient && (
                        <ProfileImage
                            bgColor={item.patient.colorCode ?? '0000'}
                            name={patientName}
                            url={item.patient.img ?? ''}
                        />
                    )}
                    <div>
                        <h3 className='font-semibold uppercase'>{patientName}</h3>
                        <span className='text-xs capitalize md:text-sm'>
                            {item.patient?.gender?.toLowerCase() ?? 'n/a'}
                        </span>
                    </div>
                </td>

                <td className='hidden md:table-cell'>
                    {item.appointmentDate ? format(new Date(item.appointmentDate), 'yyyy-MM-dd') : 'N/A'}
                </td>
                <td className='hidden md:table-cell'>{item.time ?? 'N/A'}</td>

                <td className='hidden items-center py-2 md:table-cell'>
                    {item.doctor && (
                        <div className='flex items-center gap-2 md:gap-4'>
                            <ProfileImage
                                bgColor={item.doctor.colorCode ?? '0000'}
                                name={item.doctor.name}
                                textClassName='text-black'
                                url={item.doctor.img ?? ''}
                            />
                            <div>
                                <h3 className='font-semibold uppercase'>{item.doctor.name}</h3>
                                <span className='text-xs capitalize md:text-sm'>
                                    {item.doctor.specialization ?? 'N/A'}
                                </span>
                            </div>
                        </div>
                    )}
                </td>

                <td className='hidden xl:table-cell'>
                    <AppointmentStatusIndicator status={mapStatus(item.status)} />
                </td>

                <td>
                    <div className='flex items-center gap-2'>
                        <ViewAppointment id={item.id} />
                        <AppointmentActionOptions
                            appointmentId={item.id}
                            doctorId={item.doctorId ?? 'N/A'}
                            patientId={item.patientId ?? 'N/A'}
                            status={mapStatus(item.status)}
                            userId={userId ?? 'N/A'}
                        />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className='rounded-xl bg-white p-2 md:p-4 2xl:p-6'>
            <div className='flex items-center justify-between'>
                <div className='hidden items-center gap-1 lg:flex'>
                    <BriefcaseBusinessIcon
                        className='text-gray-500'
                        size={20}
                    />
                    <p className='font-semibold text-2xl'>{totalRecord}</p>
                    <span className='text-gray-600 text-sm xl:text-base'>total appointments</span>
                </div>

                <div className='flex w-full items-center justify-between gap-2 lg:w-fit lg:justify-start'>
                    <SearchInput />
                    {isPatient && <AppointmentContainer id={userId ?? 'N/A'} />}
                </div>
            </div>

            <div className='mt-6'>
                <Table
                    columns={columns}
                    data={data}
                    renderRow={renderItem}
                />
                {data.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        limit={DATA_LIMIT}
                        totalPages={totalPages}
                        totalRecords={totalRecord}
                    />
                )}
            </div>
        </div>
    );
}
