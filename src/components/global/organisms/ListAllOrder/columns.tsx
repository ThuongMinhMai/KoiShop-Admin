import { ColumnDef } from '@tanstack/react-table'
import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
import { Badge } from '../../atoms/ui/badge'
// import { DataTableRowActions } from './row-actions';
import { useNavigate } from 'react-router-dom'
import { DataTableRowActions } from './row-actions'
import { Button } from '../../atoms/ui/button'
import { SquarePen } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'

interface Order {
  id: number
  userId: number
  orderDate: string
  totalAmount: number
  orderStatus: string
  shippingAddress: string
  paymentMethod: string
  userName: string
  note: string
  walletTransaction: string
  orderDetails: []
}

export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (order: Order, status: string) => void,
  handleShowOrderDetailsModal: (order: Order) => void
): ColumnDef<Order>[] => {
  const { user } = useAuth()
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'userName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='User Name' />,
      cell: ({ row }) => <div>{row.getValue('userName')}</div>,
      enableHiding: false
    },
    {
      accessorKey: 'orderDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Order Date' />,
      cell: ({ row }) => {
        const rawDate = row.getValue('orderDate') as string
        const dateObject = new Date(rawDate)
        const formattedDate = !isNaN(dateObject.getTime())
          ? dateObject.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Invalid Date'
        return <div>{formattedDate}</div>
      }
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Total Amount' />,
      cell: ({ row }) => <div>{row.getValue('totalAmount')}</div>
    },
    {
      accessorKey: 'orderStatus',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Order Status' />,
      cell: ({ row }) => {
        return <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'shippingAddress',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Shipping Address' />,
      cell: ({ row }) => <div>{row.getValue('shippingAddress')}</div>
    },
    {
      accessorKey: 'paymentMethod',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Payment Method' />,
      cell: ({ row }) => <div>{row.getValue('paymentMethod')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'note',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Note' />,
      cell: ({ row }) => (
        <span className='cursor-pointer'>
          {row.getValue('note')}
        </span>
      )
    },
    {
      accessorKey: 'actions',
      header: ({ column }) => null,
      cell: ({ row }) => <Button onClick={() => handleShowOrderDetailsModal(row.original)} size='icon' variant='ghost'><SquarePen className='w-4 h-4'/></Button>
    }
  ]
}
