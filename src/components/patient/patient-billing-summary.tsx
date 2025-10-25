'use client';

type PatientBillingSummaryProps = {
    patientId: string;
};

export function PatientBillingSummary({ patientId }: PatientBillingSummaryProps) {
    return (
        <div className='rounded border p-4'>
            <h3 className='font-semibold text-lg'>Billing Summary</h3>
            <p>Display billing info for patient {patientId}</p>
        </div>
    );
}
