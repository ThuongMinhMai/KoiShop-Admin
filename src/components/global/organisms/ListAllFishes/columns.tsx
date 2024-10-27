import { ColumnDef } from '@tanstack/react-table'
import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
import { User, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../atoms/ui/badge'
import { DataTableRowActions } from './row-actions'

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

export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (fish: Fish, status: boolean) => void,
  handleEditName: (fish: Fish, newName: string) => void,
  handleShowAmentiModal: (fish: Fish) => void
): ColumnDef<Fish>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'koiFishImages',
      header: ({ column }) => <DataTableColumnHeader column={column} title='koi Fish Images' />,
      cell: ({ row }) => (
        <div>
          <img
            className='rounded-full h-12 w-12 object-cover drop-shadow-lg'
            src={row.getValue('koiFishImages')}
            alt='koiFishImages'
          />
        </div>
      ),
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Fish Name' />,
      cell: ({ row }) => (
        <div>
          <span className='max-w-[500px] truncate font-medium '>{row.getValue('name')}</span>
        </div>
      ),
      enableHiding: false
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
      cell: ({ row }) => <div>{row.getValue('price')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'ownerId',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Owner ID' />,
      cell: ({ row }) => <div>{row.getValue('ownerId')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'origin',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Origin' />,
      cell: ({ row }) => <div>{row.getValue('origin')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Gender' />,
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Date of Birth' />,
      cell: ({ row }) => {
        const rawDate = row.getValue('dob') as string
        const dateObject = new Date(rawDate)
        const formattedDate = !isNaN(dateObject.getTime())
          ? dateObject.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Invalid Date'
        return <div>{formattedDate}</div>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'length',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Length' />,
      cell: ({ row }) => <div>{row.getValue('length')}cm</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'weight',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Weight' />,
      cell: ({ row }) => <div>{row.getValue('weight')}g</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'personalityTraits',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Character' />,
      cell: ({ row }) => <div>{row.getValue('personalityTraits')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'dailyFeedAmount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Feed Amount' />,
      cell: ({ row }) => <div>{row.getValue('dailyFeedAmount')}g</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'lastHealthCheck',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Last Health Check' />,
      cell: ({ row }) => {
        const rawDate = row.getValue('lastHealthCheck') as string
        const dateObject = new Date(rawDate)
        const formattedDate = !isNaN(dateObject.getTime())
          ? dateObject.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Invalid Date'
        return <div>{formattedDate}</div>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'isAvailableForSale',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        const isAvailableForSale = row.getValue('isAvailableForSale') as boolean
        return (
          <div className='flex items-center'>
            {/* <Tooltip
              title={
                isAvailableForSale
                  ? 'This fish is available for sale!'
                  : 'This fish is not available for sale!'
              }
            >
              <Badge variant={isAvailableForSale ? 'success' : 'destructive'}>
                {isAvailableForSale ? 'Available' : 'Not Available'}
              </Badge>
            </Tooltip> */}
            <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />
          </div>
          
        )
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id)
        if (typeof rowValue === 'boolean') {
          return Array.isArray(value) ? value.includes(rowValue) : rowValue === value
        }
        return false
      }
    }
  ]
}
