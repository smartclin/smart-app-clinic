'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import type { InputProps, InputRenderProps } from 'react-aria-components';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type StyleOrFunction =
    | React.CSSProperties
    | ((props: InputRenderProps & { defaultStyle: React.CSSProperties }) => React.CSSProperties);

interface PasswordInputProps extends InputProps {
    style?: StyleOrFunction;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, style, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const disabled = props.value === '' || props.value === undefined || props.disabled;

    const mergedStyle: React.CSSProperties =
        typeof style === 'function'
            ? (style({
                  defaultStyle: {},
                  ...props,
                  isHovered: false,
                  isFocused: false,
                  isFocusVisible: false,
                  isDisabled: false,
                  isInvalid: false
              }) ?? {})
            : (style ?? {});

    return (
        <div className='relative'>
            <Input
                {...props}
                className={cn('hide-password-toggle pr-10', className)}
                ref={ref}
                style={mergedStyle}
                type={showPassword ? 'text' : 'password'}
            />
            <Button
                className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                disabled={disabled}
                onClick={() => setShowPassword(prev => !prev)}
                size='sm'
                type='button'
                variant='ghost'
            >
                {showPassword && !disabled ? (
                    <EyeIcon
                        aria-hidden='true'
                        className='h-4 w-4'
                    />
                ) : (
                    <EyeOffIcon
                        aria-hidden='true'
                        className='h-4 w-4'
                    />
                )}
                <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>

            <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
        </div>
    );
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
