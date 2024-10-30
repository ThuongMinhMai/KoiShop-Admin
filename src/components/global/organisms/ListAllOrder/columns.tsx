import { ColumnDef } from '@tanstack/react-table';
import { Tooltip } from 'antd';
import { DataTableColumnHeader } from '../table/col-header';
import { Badge } from '../../atoms/ui/badge';
// import { DataTableRowActions } from './row-actions';
import { useNavigate } from 'react-router-dom'
import { DataTableRowActions } from './row-actions';

interface Order {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
  shippingAddress: string;
  paymentMethod: string;
  note: string;
  walletTransaction: string;
  orderDetails: object[];
}

export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (order: Order, status: string) => void,
  handleEditNote: (order: Order, newNote: string) => void,
): ColumnDef<Order>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'userId',
      header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
      cell: ({ row }) => <div>{row.getValue('userId')}</div>,
      enableHiding: false
    },
    {
      accessorKey: 'orderDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
      cell: ({ row }) => {
        const rawDate = row.getValue('orderDate') as string;
        const dateObject = new Date(rawDate);
        const formattedDate = !isNaN(dateObject.getTime())
          ? dateObject.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Invalid Date';
        return <div>{formattedDate}</div>;
      }
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
      cell: ({ row }) => <div>{row.getValue('totalAmount')}</div>
    },
    {
      accessorKey: 'orderStatus',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order Status" />,
      cell: ({ row }) => {
        // const orderStatus = row.getValue('orderStatus') as string;

        // const statusBadgeVariant: Record<'PENDING' |'SHIPPED'| 'DELIVERED' | 'CANCELLED', 'default' | 'warning'|'info' | 'success' | 'breed'> = {
        //   PENDING: 'warning',
        //   SHIPPED: 'info',
        //   DELIVERED: 'success',
        //   CANCELLED: 'breed'
        // };

        // const badgeVariant = statusBadgeVariant[orderStatus as keyof typeof statusBadgeVariant] || 'default';

        // return (
        //   <Badge variant={badgeVariant}>
        //     {orderStatus || 'Unknown Status'}
        //   </Badge>
        // );
        return <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))

    },
    {
      accessorKey: 'shippingAddress',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Shipping Address" />,
      cell: ({ row }) => <div>{row.getValue('shippingAddress')}</div>
    },
    {
      accessorKey: 'paymentMethod',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Method" />,
      cell: ({ row }) => <div>{row.getValue('paymentMethod')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))

    },
    {
      accessorKey: 'note',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Note" />,
      cell: ({ row }) => (
        <Tooltip title="Edit Note">
          <span className="cursor-pointer" onClick={() => handleEditNote(row.original, row.getValue('note') as string)}>
            {row.getValue('note')}
          </span>
        </Tooltip>
      )
    },
    {
      accessorKey: 'walletTransaction',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Wallet Transaction" />,
      cell: ({ row }) => <div>{row.getValue('walletTransaction')}</div>
    },
    {
      accessorKey: 'orderDetails',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order Details" />,
      cell: ({ row }) => <div>{JSON.stringify(row.getValue('orderDetails'))}</div>
    }
  ];
};
