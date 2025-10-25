'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';

export const signupSchema = z.object({
    name: z.string().min(1, {
        error: 'Name is required.'
    }),
    email: z.email({
        error: 'Please enter a valid email.'
    }),
    password: z.string().min(8, {
        error: 'Password must be at least 8 characters.'
    })
});

export default function SignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: '', email: '', password: '' }
    });

    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true);

        try {
            await signUp.email(
                {
                    name: values.name,
                    email: values.email,
                    password: values.password
                },
                {
                    onSuccess: () => {
                        toast.success('Account created', {
                            description: 'Welcome! Redirecting to your dashboard...'
                        });
                        router.replace('/dashboard');
                    },
                    onError: (err: { error: Error }) => {
                        toast.error('Signup failed', { description: err.error.message });
                    }
                }
            );
        } catch (err) {
            console.error(err);
            toast.error('Unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className='space-y-6'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {/* Name */}
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='John Doe'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='johndoe@example.com'
                                    type='email'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    autoComplete='new-password'
                                    placeholder='••••••••'
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className='flex items-center justify-between text-xs'>
                                <label className='flex cursor-pointer select-none items-center gap-2'>
                                    <Checkbox
                                        checked={showPassword}
                                        onCheckedChange={(checked: boolean | 'indeterminate') =>
                                            setShowPassword(Boolean(checked))
                                        }
                                    />
                                    Show password
                                    <textarea />
                                </label>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <Button
                    className='w-full'
                    disabled={isSubmitting}
                    type='submit'
                >
                    {isSubmitting ? (
                        <span className='flex items-center justify-center gap-2'>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent' />
                            Creating account...
                        </span>
                    ) : (
                        'Sign Up'
                    )}
                </Button>
            </form>
        </Form>
    );
}
