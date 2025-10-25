import { Button } from '@/components/ui/button';

type DataPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const DataPagination = ({ page, totalPages, onPageChange }: DataPaginationProps) => {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex-1 text-muted-foreground text-sm'>
                Page {page} of {totalPages || 1}
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <Button
                    disabled={page === 1}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    size='sm'
                    variant='outline'
                >
                    Previous
                </Button>
                <Button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    size='sm'
                    variant='outline'
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
