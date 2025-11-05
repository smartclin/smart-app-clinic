'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, MailIcon, UserIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

import { GenderRadioGroup } from '../components/gender-radio-group';
import InputPasswordContainer from '../components/input-password';
import InputStartIcon from '../components/input-start-icon';
import { SignUpSchema, type SignUpValues } from './validate';

export default function SignUpForm() {
    const [isPending, startTransition] = useTransition();
    const form = useForm<SignUpValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            gender: false
        }
    });

    function onSubmit(data: SignUpValues) {
        startTransition(async () => {
            console.log('submit data:', data);
            const response = await signUp.email(data);

            if (response.error) {
                console.log('SIGN_UP:', response.error.status);
                toast.error(response.error.message);
            } else {
                redirect('/');
            }
        });
    }

    const getInputClassName = (fieldName: keyof SignUpValues) =>
        cn(
            form.formState.errors[fieldName] &&
                'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20'
        );

    return (
        <Form {...form}>
            <form
                className='z-50 my-8 flex w-full flex-col gap-5'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputStartIcon icon={UserIcon}>
                                    <Input
                                        className={cn('peer ps-9', getInputClassName('name'))}
                                        disabled={isPending}
                                        placeholder='Name'
                                        {...field}
                                    />
                                </InputStartIcon>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputStartIcon icon={MailIcon}>
                                    <Input
                                        className={cn('peer ps-9', getInputClassName('email'))}
                                        disabled={isPending}
                                        placeholder='Email'
                                        {...field}
                                    />
                                </InputStartIcon>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputStartIcon icon={AtSign}>
                                    <Input
                                        className={cn('peer ps-9', getInputClassName('username'))}
                                        disabled={isPending}
                                        placeholder='Username'
                                        {...field}
                                    />
                                </InputStartIcon>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputPasswordContainer>
                                    <Input
                                        className={cn('pe-9', getInputClassName('password'))}
                                        disabled={isPending}
                                        placeholder='Password'
                                        {...field}
                                    />
                                </InputPasswordContainer>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputPasswordContainer>
                                    <Input
                                        className={cn('pe-9', getInputClassName('confirmPassword'))}
                                        disabled={isPending}
                                        placeholder='Confirm Password'
                                        {...field}
                                    />
                                </InputPasswordContainer>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Gender */}
                <FormField
                    control={form.control}
                    name='gender'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <GenderRadioGroup
                                onChange={field.onChange}
                                value={field.value}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className='mt-5 w-full'
                    disabled={isPending}
                    type='submit'
                >
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}
