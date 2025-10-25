import { headers } from 'next/headers';

import { auth } from '@/server/auth';

type UserGateProps = {
    children: (isAdministratorUser: boolean) => React.ReactNode;
};

export async function UserAuthGate({ children }: UserGateProps) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const isAdministratorUser = !!session?.user;

    return <>{children(isAdministratorUser)}</>;
}
