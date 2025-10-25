import { endOfMonth, format, getMonth, startOfYear } from 'date-fns';

// --- Utility types and functions ---
export type AppointmentStatus = 'CANCELLED' | 'COMPLETED' | 'PENDING' | 'SCHEDULED';

type Appointment = {
    appointmentDate: Date;
    status: AppointmentStatus | null;
};

function isValidStatus(status: string): status is AppointmentStatus {
    return ['CANCELLED', 'COMPLETED', 'PENDING', 'SCHEDULED'].includes(status);
}

const initializeMonthlyData = () => {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = getMonth(new Date());

    return Array.from({ length: currentMonthIndex + 1 }, (_, index) => ({
        appointment: 0,
        completed: 0,
        name: format(new Date(currentYear, index), 'MMM')
    }));
};

export const processAppointments = (appointments: Appointment[]) => {
    const monthlyData = initializeMonthlyData();
    const appointmentCounts: Record<AppointmentStatus, number> = {
        CANCELLED: 0,
        COMPLETED: 0,
        PENDING: 0,
        SCHEDULED: 0
    };

    const currentYearStart = startOfYear(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    for (const appointment of appointments) {
        const { status, appointmentDate } = appointment;

        // Aggregate counts for appointments within the current year and up to the current month
        if (appointmentDate >= currentYearStart && appointmentDate <= currentMonthEnd) {
            const monthIndex = getMonth(appointmentDate);
            if (monthlyData[monthIndex]) {
                monthlyData[monthIndex].appointment++;
                if (status === 'COMPLETED') {
                    monthlyData[monthIndex].completed++;
                }
            }
        }

        // Aggregate counts for all appointments by status
        if (status && isValidStatus(status)) {
            appointmentCounts[status]++;
        }
    }

    return { appointmentCounts, monthlyData };
};

export type AllAppointmentsProps = {
    page: number | string;
    limit?: number | string;
    search?: string;
    id?: string;
};
