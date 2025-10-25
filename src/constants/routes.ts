export const searchParamsKey = {
    redirectUrl: 'redirect_url'
} as const;

export const route = {
    // Public routes
    home: '/',
    signUp: process.env['NEXT_PUBLIC_SIGN_UP_URL'],
    signIn: process.env['NEXT_PUBLIC_SIGN_IN_URL'],
    auth: {
        LOGIN: '/login',
        CALLBACK: '/api/auth/callback'
    },
    // Protected Routes
    admin: '/admin',
    adminSystemSettings: '/admin/system-settings',

    doctor: '/doctor',
    patient: '/patient',
    patientDashboard: (patientId: string) => `/patient/${patientId}/dashboard`,
    patientProfile: (patientId: string) => `/patient/${patientId}`,
    patientList: '/patient',
    patientRegistration: '/patient/registration',

    // Record Routes
    recordAppointments: '/record/appointments',
    recordAppointmentDetails: (id: string) => `/record/appointments/${id}`,
    recordBilling: '/record/billing',
    recordDoctors: '/record/doctors',
    recordDoctorDetails: (id: string) => `/record/doctors/${id}`,
    recordMedicalRecords: '/record/medical-records',
    recordPatients: '/record/patients',
    recordStaffs: '/record/staffs',
    recordUsers: '/record/users'
} as const;
