import Link from 'next/link';
import { FaGithub, FaRocket } from 'react-icons/fa6';

import ThemeToggler from '@/components/common/theme-toggler';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/constants/app-routes';
import siteConfig from '@/lib/config';

const Header = () => (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
            <div className='flex gap-6 md:gap-10'>
                <Link
                    className='flex items-center space-x-2'
                    href='/'
                >
                    <FaRocket className='h-6 w-6' />
                    <span className='hidden font-bold sm:inline-block'>{siteConfig.title}</span>
                </Link>
            </div>
            <div className='flex flex-1 items-center justify-end space-x-4'>
                <nav className='flex items-center space-x-4'>
                    <Button
                        asChild
                        variant='ghost'
                    >
                        <Link
                            href={siteConfig.github.repoLink}
                            rel='noreferrer'
                            target='_blank'
                        >
                            <FaGithub className='h-5 w-5' />
                            <span className='sr-only'>GitHub</span>
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={APP_ROUTES.AUTH.SIGN_IN}>Get Started</Link>
                    </Button>
                    <ThemeToggler />
                </nav>
            </div>
        </div>
    </header>
);

export default Header;
