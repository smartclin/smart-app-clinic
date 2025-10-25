import Link from 'next/link';
import { FaGithub, FaRocket } from 'react-icons/fa6';

import siteConfig from '@/lib/config';

const Footer = () => (
    <footer className='w-full border-t bg-background py-6'>
        <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='flex items-center space-x-2'>
                    <FaRocket className='h-6 w-6' />
                    <span className='font-bold'>Next15 Boilerplate</span>
                </div>
                <p className='text-muted-foreground text-sm'>
                    © {new Date().getFullYear()} Next15 Boilerplate. All rights reserved.
                </p>
                <div className='flex items-center space-x-4'>
                    <Link
                        className='text-muted-foreground hover:text-foreground'
                        href={siteConfig.github.repoLink}
                        rel='noreferrer'
                        target='_blank'
                    >
                        <FaGithub className='h-5 w-5' />
                        <span className='sr-only'>GitHub</span>
                    </Link>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
