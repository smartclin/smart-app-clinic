import { api } from '@/trpc/server';

import { BookAppointment } from './forms/book-appointment';

export const AppointmentContainer = async ({ id }: { id: string }) => {
    const patient = await api.patient.getPatientById(id);
    const doctorsRes = await api.doctor.getDoctors();
    const doctors = doctorsRes.data;

    if (!patient || !doctors) return null;

    return (
        <div>
            <BookAppointment
                data={patient}
                doctors={doctors}
            />
        </div>
    );
};
