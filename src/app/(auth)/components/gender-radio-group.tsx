import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const options = [
    { id: 'male', label: 'Male', value: false },
    { id: 'female', label: 'Female', value: true }
];

export function GenderRadioGroup({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
    return (
        <RadioGroup
            className='grid grid-cols-3 gap-4'
            onValueChange={val => onChange(val === 'true')}
            value={String(value)}
        >
            {options.map(opt => (
                <div
                    className={cn(
                        'mt-2 flex items-center space-x-2 rounded-lg px-4 py-2 ring transition-all duration-300',
                        value === opt.value
                            ? 'bg-muted text-foreground ring-primary/10'
                            : 'text-muted-foreground ring-muted hover:bg-muted'
                    )}
                    key={opt.id}
                >
                    <RadioGroupItem
                        className='peer sr-only'
                        id={opt.id}
                        value={String(opt.value)}
                    />
                    <Label
                        className='mx-auto flex w-full cursor-pointer items-center justify-center font-medium text-sm transition-all duration-300'
                        htmlFor={opt.id}
                    >
                        {opt.label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}
