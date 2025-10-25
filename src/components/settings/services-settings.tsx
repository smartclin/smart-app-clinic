import type { Services } from '@prisma/client';

import { api } from '@/trpc/server';

import { AddService } from '../dialogs/add-service';
import { Table } from '../tables/table';
import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const columns = [
    {
        header: 'ID',
        key: 'id',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Service Name',
        key: 'name',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Price',
        key: 'price',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Description',
        key: 'description',
        className: 'hidden xl:table-cell'
    }
    // {
    //   header: "Actions",
    //   key: "action",
    // },
]; // app/(dashboard)/settings/service-settings.tsx

export const ServiceSettings = async () => {
    const response = await api.admin.getServices(); // ✅ query instead of prefetch
    const services = response ?? []; // fallback

    const renderRow = (item: Services) => (
        <tr
            className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
            key={item.id}
        >
            <td className='flex items-center gap-2 py-4 md:gap-4'>{item.id}</td>
            <td className='hidden md:table-cell'>{item.serviceName}</td>
            <td className='hidden capitalize md:table-cell'>{item?.price?.toFixed(2)}</td>
            <td className='hidden w-[50%] xl:table-cell'>
                <p className='line-clamp-1'>{item.description ?? ''}</p>
            </td>
        </tr>
    );

    return (
        <>
            <CardHeader className='flex flex-row items-center justify-between'>
                <div>
                    <CardTitle className='capitalize'>Services</CardTitle>
                    <CardDescription>
                        Perform all settings and other parameters of the system from this section.
                    </CardDescription>
                </div>
                <AddService />
            </CardHeader>

            <CardContent>
                {services.length > 0 ? (
                    <Table
                        columns={columns}
                        data={services}
                        renderRow={renderRow}
                    />
                ) : (
                    <p className='text-muted-foreground text-sm'>No services available</p>
                )}
            </CardContent>
        </>
    );
};
