import type React from 'react';
import type { Control, FieldValues } from 'react-hook-form';

import type { Day } from '@/lib/schema';

import { RenderInput } from './render-input';
import { FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

type InputProps<T extends FieldValues> = {
    type: 'input' | 'select' | 'checkbox' | 'switch' | 'radio' | 'textarea';
    control: Control<T>;
    name: keyof T & string;
    label?: string;
    placeholder?: string;
    inputType?: 'text' | 'email' | 'password' | 'date';
    selectList?: { label: string; value: string }[];
    defaultValue?: string;
};

export const CustomInput = <T extends FieldValues>(props: InputProps<T>) => {
    const { name, label, control, type, ...rest } = props;

    return (
        <FormField
            control={control as unknown as Control<FieldValues>}
            name={name}
            render={({ field }) => (
                <FormItem className='w-full'>
                    {/* Only show label for non-radio/checkbox */}
                    {type !== 'radio' && type !== 'checkbox' && label && <FormLabel>{label}</FormLabel>}

                    <RenderInput
                        field={field}
                        type={type}
                        {...rest} // pass placeholder, inputType, selectList, defaultValue, etc.
                    />

                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

type SwitchProps = {
    data: { label: string; value: Day['day'] }[];
    selectedDays: Day[];
    setWorkSchedule: React.Dispatch<React.SetStateAction<Day[]>>;
};

export const SwitchInput = ({ data, setWorkSchedule }: SwitchProps) => {
    // field is keyof Day or boolean true for toggle on/off
    const handleChange = (day: Day['day'], field: keyof Day | true, value?: string) => {
        setWorkSchedule(prevDays => {
            const dayExist = prevDays.find(d => d.day === day);

            if (dayExist) {
                // Update existing day
                if (field === true) {
                    // Toggle off: remove the day
                    return prevDays.filter(d => d.day !== day);
                }
                return prevDays.map(d => (d.day === day ? { ...d, [field]: value } : d));
            }

            // Add new day if toggled on
            if (field === true) {
                return [...prevDays, { day, startTime: '09:00', closeTime: '17:00' }];
            }

            // Add new day with specific field update
            return [
                ...prevDays,
                {
                    day,
                    startTime: field === 'startTime' ? (value ?? '09:00') : '09:00',
                    closeTime: field === 'closeTime' ? (value ?? '17:00') : '17:00'
                }
            ];
        });
    };

    return (
        <div>
            {data?.map(el => (
                <div
                    className='flex w-full items-center space-y-3 border-t border-t-gray-200 py-3'
                    key={el.label}
                >
                    <Switch
                        className='peer data-[state=checked]:bg-blue-600'
                        id={el.value}
                        onCheckedChange={checked => handleChange(el.value, true, checked ? '09:00' : undefined)}
                    />
                    <Label
                        className='w-20 capitalize'
                        htmlFor={el.value}
                    >
                        {el.value}
                    </Label>

                    <Label className='pl-10 font-normal text-gray-400 italic peer-data-[state=checked]:hidden'>
                        Not working on this day
                    </Label>

                    <div className='hidden items-center gap-2 pl-6 peer-data-[state=checked]:flex'>
                        <Input
                            defaultValue='09:00'
                            name={`${el.label}.startTime`}
                            onChange={e => handleChange(el.value, 'startTime', e.target.value)}
                            type='time'
                        />
                        <Input
                            defaultValue='17:00'
                            name={`${el.label}.closeTime`}
                            onChange={e => handleChange(el.value, 'closeTime', e.target.value)}
                            type='time'
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
