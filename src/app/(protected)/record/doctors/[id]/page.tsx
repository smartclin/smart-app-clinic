import { ProfileImage } from '@/components/profile-image';
import { RecentAppointments } from '@/components/tables/recent-appointment';
import { api } from '@/trpc/server';
import { AppointmentStatus, type PartialAppointment } from '@/types';

const DoctorProfile = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;

    const { data } = await api.doctor.getDoctorById(params?.id);

    if (!data) return null;

    // Map appointments to match PartialAppointment type
    const mappedAppointments: PartialAppointment[] = (data?.appointments ?? []).map(a => ({
        id: a.id,
        appointmentDate: a.appointmentDate,
        time: a.time,
        status: (a.status as AppointmentStatus) || AppointmentStatus.PENDING,
        reason: a.reason ?? null,
        patient: {
            id: a.patient.id,
            firstName: a.patient.firstName,
            lastName: a.patient.lastName,
            img: a.patient.image ?? '/default-avatar.png', // Correctly map `image` to `img`
            colorCode: a.patient.colorCode,
            gender: a.patient.gender,
            dateOfBirth: new Date() // Add placeholder for missing dateOfBirth
        },
        doctor: {
            id: data.id,
            name: data.name,
            specialization: data.specialization ?? 'N/A',
            img: data.img ?? '/default-avatar.png',
            colorCode: data.colorCode ?? '#000000'
        },
        img: a.patient.image ?? '/default-avatar.png'
    }));

    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ProfileImage
                    bgColor={data?.colorCode ?? '0000'}
                    className='size-20'
                    name={data?.name}
                    textClassName='text-4xl text-black'
                    url={data?.img ?? ''}
                />
            </div>

            <RecentAppointments data={mappedAppointments} />
        </div>
    );
};

export default DoctorProfile;
