import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'
import { useAuth } from '@/auth/AuthProvider'

interface DataTableRowActionsProps<TData extends Order> {
  row: Row<TData>
  handleStatusChange: (order: Order, status: string) => void
}

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

export function DataTableRowActions<TData extends Order>({ row, handleStatusChange }: DataTableRowActionsProps<TData>) {
  const { user } = useAuth()
  const statusString = row.original.orderStatus
  return (
    <div>
      <Select
        value={statusString}
        onValueChange={(value) => handleStatusChange(row.original, value)}
        disabled={statusString === 'REFUNDED' || statusString === 'COMPLETED' || statusString === 'PROCESSING' || user?.roleName === 'STAFF'}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value='PENDING'>
            <Badge variant='warning'>Pending</Badge>
          </SelectItem>
          <SelectItem value='PROCESSING'>
            <Badge variant='info'>Processing</Badge>
          </SelectItem>
          <SelectItem value='REFUNDED'>
            <Badge variant='destructive'>Refunded</Badge>
          </SelectItem>
          {statusString !== 'PENDING' && (
            <SelectItem value='COMPLETED'>
              <Badge variant='success'>Completed</Badge>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
