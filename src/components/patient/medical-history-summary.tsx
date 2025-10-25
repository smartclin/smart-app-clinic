'use client';

type MedicalHistorySummaryProps = {
    patientId: string;
};

export function MedicalHistorySummary({ patientId }: MedicalHistorySummaryProps) {
    return (
        <div className='rounded border p-4'>
            <h3 className='font-semibold text-lg'>Medical History</h3>
            <p>Display past medical history for patient {patientId}</p>
        </div>
    );
}
