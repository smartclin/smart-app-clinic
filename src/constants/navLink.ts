// src/constants/navLinks.ts
export type NavLink = {
    label: string;
    href: string;
    icon?: string; // optional icon name if you plan to use an icon library
    children?: NavLink[];
};

export const publicNavLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Sign In', href: '/signin' },
    { label: 'Sign Up', href: '/signup' }
];

export const protectedNavLinks: NavLink[] = [
    { label: 'Dashboard', href: '' },
    { label: 'Doctor', href: '/doctor' },
    { label: 'Patient', href: '/patient' },
    { label: 'Records', href: '/record' }
];

export const adminNavLinks: NavLink[] = [
    { label: 'Admin Dashboard', href: '/admin' },
    {
        label: 'System Settings',
        href: '/admin/system-settings'
    }
];

export const doctorNavLinks: NavLink[] = [
    { label: 'Doctor Dashboard', href: '/doctor' },
    {
        label: 'Patients',
        href: '/record/patients'
    },
    {
        label: 'Appointments',
        href: '/record/appointments'
    }
];

export const patientNavLinks: NavLink[] = [
    { label: 'Patient Home', href: '/patient' },
    { label: 'Registration', href: '/patient/registration' }
];

export const recordNavLinks: NavLink[] = [
    {
        label: 'Appointments',
        href: '/record/appointments'
    },
    {
        label: 'Billing',
        href: '/record/billing'
    },
    {
        label: 'Doctors',
        href: '/record/doctors'
    },
    {
        label: 'Medical Records',
        href: '/record/medical-records'
    },
    {
        label: 'Patients',
        href: '/record/patients'
    },
    {
        label: 'Staffs',
        href: '/record/staffs'
    },
    {
        label: 'Users',
        href: '/record/users'
    }
];
