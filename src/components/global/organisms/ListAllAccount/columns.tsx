import { ColumnDef } from '@tanstack/react-table'

import { Tooltip } from 'antd'
import { DataTableColumnHeader } from '../table/col-header'
import { User, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../../atoms/ui/badge'
import { DataTableRowActions } from './row-actions'

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
export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleStatusChange: (account: Account, status: boolean) => void,
  handleEditName: (account: Account, newName: string) => void,
  handleShowAmentiModal: (account: Account) => void
): ColumnDef<Account>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => null,
      cell: ({ row }) => null,
      enableHiding: false
    },
    {
      accessorKey: 'imageUrl',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Image' />,
      cell: ({ row }) => (
        <div>
          {/* <Tooltip title='Chỉnh sửa' className='mr-1'>
          <Edit2 className='cursor-pointer w-4 text-primary' onClick={() => handleEditName(row.original, row.getValue('roomName'))} />
        </Tooltip> */}
          <img
            className='rounded-full h-12 w-12 object-cover drop-shadow-lg'
            src={row.getValue('imageUrl')} // Access the image URL correctly
            alt='account'
          />
        </div>
      ),
      // filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableHiding: false
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Account name' />,
      cell: ({ row }) => (
        <div>
        
          <span className='max-w-[500px] truncate font-medium '>{row.getValue('fullName')}</span>
        </div>
      ),
      enableHiding: false
    },
   
    
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title='PhoneNumber' />,
      cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
     
    },

    {
      accessorKey: 'address',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },

   
   
    {
      accessorKey: 'dob',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Date of birth' />,
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
      accessorKey: 'loyaltyPoints',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Points' />,
      cell: ({ row }) => <div>{row.getValue('loyaltyPoints')}</div>,
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'roleName',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Rolename' />,
      cell: ({ row }) => {
        const roleName = row.getValue('roleName') as string;
    
        const roleBadgeVariant: Record<'ADMIN' | 'MANAGER' | 'CUSTOMER' | 'STAFF', "breed" | "info" | "default" | "warning"> = {
          ADMIN: 'breed',    
          MANAGER: 'info',       
          CUSTOMER: 'default',     
          STAFF: 'warning'   
        };
    
        const badgeVariant = roleBadgeVariant[roleName as keyof typeof roleBadgeVariant] || 'default';
    
        return (
          <Badge variant={badgeVariant}>
            {roleName || 'Unknown Role'}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id))
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => {
        // Check if the roleName is 'Admin'
        const roleName = row.getValue('roleName') as string
        const isActive = row.getValue('isActive') as boolean

        if (roleName === 'MANAGER' || roleName==="ADMIN") {
          // Show the status if the roleName is Admin
          return (
            <div className='flex items-center'>
              <Tooltip
                title={
                  isActive ? 'You do not have permission to edit this account!' : 'You do not have permission to edit this account!'
                }
              >
                <Badge variant={isActive ? 'success' : 'destructive'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Tooltip>
            </div>
          )
        } else {
          // Use DataTableRowActions component for non-Admin roles
          return <DataTableRowActions row={row} handleStatusChange={handleStatusChange} />
        }
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
