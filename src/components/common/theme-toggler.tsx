'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';

const ThemeToggler = () => {
    const t = useTranslations();
    const { resolvedTheme, setTheme } = useTheme();
    const toggleCurrentTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    const ariaLabel = t('Components.common.themeToggler.label');

    return (
        <Button
            aria-label={ariaLabel}
            onClick={toggleCurrentTheme}
            type='button'
        >
            <FaMoon
                className='block dark:hidden'
                height='20'
            />
            <FaSun
                className='hidden dark:block'
                height='20'
            />
        </Button>
    );
};

export default ThemeToggler;
