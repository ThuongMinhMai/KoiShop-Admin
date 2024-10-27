import { Row } from '@tanstack/react-table'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'

interface DataTableRowActionsProps<TData extends Fish> {
  row: Row<TData>
  handleStatusChange: (fish: Fish, status: boolean) => void
}

interface Fish {
  id: number
  name: string
  origin: string
  gender: string
  dob: string
  length: number
  weight: number
  personalityTraits: string
  dailyFeedAmount: number
  lastHealthCheck: Date
  isAvailableForSale: boolean
  price: number
  isConsigned: boolean
  isSold: boolean
  ownerId: number
  koiCertificates: object
  koiBreeds: object
}

export function DataTableRowActions<TData extends Fish>({
  row,
  handleStatusChange
}: DataTableRowActionsProps<TData>) {
  const statusString = row.original.isAvailableForSale ? 'true' : 'false'
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
            <Badge variant='success'>Available</Badge>
          </SelectItem>
          <SelectItem value='false'>
            <Badge variant='destructive'>Not Available</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
