import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Account> {
  row: Row<TData>
  handleStatusChange: (account: Account, status: boolean) => void
}
interface Account {
  id: number
  email: string
  fullName: string
  unsignFullName: string
  dob: string
  phoneNumber: string
  roleName: string
  imageUrl: string
  address: string
  isActive: boolean
  loyaltyPoints: number
  isDeleted: boolean
}

export function DataTableRowActions<TData extends Account>({
  row,
  handleStatusChange
}: DataTableRowActionsProps<TData>) {
  const statusString = row.original.isActive ? 'true' : 'false'

  return (
    <div>
      <Select
        value={statusString}
        onValueChange={(value) => handleStatusChange(row.original, value === 'true' ? true : false)}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value='true'>
            <Badge variant='success'>Active</Badge>
          </SelectItem>
          <SelectItem value='false'>
            <Badge variant='destructive'>Inactive</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
