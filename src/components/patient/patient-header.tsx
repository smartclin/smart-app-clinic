import { Card, CardContent } from '@/components/ui/card';

type PatientHeaderProps = {
    patient: {
        firstName?: string;
        lastName?: string;
        dob?: string | Date;
        gender?: string;
    };
};

export function PatientHeader({ patient }: PatientHeaderProps) {
    return (
        <Card>
            <CardContent className='p-4'>
                <h2 className='font-semibold text-xl'>
                    {patient.firstName} {patient.lastName}
                </h2>
                <p>DOB: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</p>
                <p>Gender: {patient.gender || 'N/A'}</p>
            </CardContent>
        </Card>
    );
}
