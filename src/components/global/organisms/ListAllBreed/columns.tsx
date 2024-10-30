import { ColumnDef } from '@tanstack/react-table';
// import { Tooltip } from 'antd';
import { DataTableColumnHeader } from '../table/col-header';
import { Badge } from '../../atoms/ui/badge';
// import { DataTableRowActions } from './row-actions';
import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/ui/button';
import { SquarePen } from 'lucide-react';

interface Breed {
  id: number;
  name: string;
  content: string;
  imageUrl: string;
  isDeleted: boolean;
}

export const columns = (
  navigate: ReturnType<typeof useNavigate>,
): ColumnDef<Breed>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    // {
    //   accessorKey: 'userId',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
    //   cell: ({ row }) => <div>{row.getValue('userId')}</div>,
    //   enableHiding: false
    // },
    // {
    //   accessorKey: 'orderDate',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
    //   cell: ({ row }) => {
    //     const rawDate = row.getValue('orderDate') as string;
    //     const dateObject = new Date(rawDate);
    //     const formattedDate = !isNaN(dateObject.getTime())
    //       ? dateObject.toLocaleDateString('vi-VN', {
    //           day: '2-digit',
    //           month: '2-digit',
    //           year: 'numeric'
    //         })
    //       : 'Invalid Date';
    //     return <div>{formattedDate}</div>;
    //   }
    // },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name of Breed" />,
      cell: ({ row }) => <div>{row.getValue('name')}</div>
    },
    {
      accessorKey: 'content',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Content" />,
      cell: ({ row }) => <div className='w-40 truncate'>
        <div className='truncate'>{row.getValue('content')}</div>
      </div>
    },
    {
      accessorKey: 'imageUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Image of breeds" />,
      cell: ({ row }) => 
      <div className='ml-5'>
        <img src={row.getValue('imageUrl') ? row.getValue('imageUrl') : 'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg'} alt={row.getValue('name')} className='w-12 h-24 rounded-lg object-cover' />
      </div>
    },
    {
      accessorKey: 'isDeleted',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deleted" />,
      cell: ({ row }) => <div>{row.getValue('isDeleted') ? <Badge className='bg-green-500 hover:bg-green-600'>true</Badge> : <Badge className='bg-red-500 hover:bg-red-600'>false</Badge>}</div>
    },
    {
      accessorKey: 'actions',
      header: ({ column }) => null,
      cell: ({ row }) => <Button variant='ghost' size='icon' onClick={() => navigate(`/breeds/${row.getValue('id')}`)}><SquarePen className='w-6 h-6'/></Button>
    },
  ];
};
