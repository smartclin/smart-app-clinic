import Image from 'next/image';
import Link from 'next/link';

import { APP_ROUTES } from '@/constants/app-routes';

const Logo = () => (
    <Link href={APP_ROUTES.HOME}>
        <Image
            alt='Logo'
            className='rounded-md'
            height={100}
            placeholder='blur'
            priority
            src='/images/logo.png'
            width={100}
        />
    </Link>
);

export default Logo;
