import { useAuth } from '@/auth/AuthProvider'
import koiAPI from '@/lib/koiAPI'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { toast } from '../../atoms/ui/use-toast'
import { DataTable } from '../table/main'
import TableSkeleton from '../TableSkeleton'
import { columns } from './columns'
import { DataTableToolbar } from './toolbar'




interface ApiResponse<T> {
  data: T
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
function ListAllAccount() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [newStatus, setNewStatus] = useState<boolean>()
  const [tempStatus, setTempStatus] = useState<{ [key: string]: boolean }>({})

  const handleShowAmentiModal = (account: Account) => {}

  useEffect(() => {
    const fetchAllAccounts = async () => {
      setIsLoadingAccounts(true)
      try {
        const response = await koiAPI.get<ApiResponse<Account[]>>(`/api/v1/users`)

        const result = response.data.data
        console.log("accc", result)
        const filteredAccounts = result.filter((account: Account) => account.roleName !== null);

        setAccounts(filteredAccounts || []);
  
        const initialStatuses: { [key: string]: boolean } = {}
        result.forEach((account: Account) => {
          initialStatuses[account.id] = account.isActive
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    fetchAllAccounts()
  }, [user?.id])

  const handleStatusChange = (account: Account, status: boolean) => {
    setSelectedAccount(account)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedAccount) {
      try {
        console.log('nre sta', newStatus)
        console.log("acc", selectedAccount)
        // Ensure `newStatus` is correctly defined as a boolean before making the API call
        const statusToUpdate = newStatus !== undefined ? newStatus : selectedAccount.isActive // Convert to boolean if necessary

        // Send the API request to update the status
        await koiAPI.put(`/api/v1/users/${selectedAccount.id}`,{
          fullName:selectedAccount.fullName,
          dob:selectedAccount.dob,
          phoneNumber:selectedAccount.phoneNumber,
          imageUrl:selectedAccount.imageUrl,
          address:selectedAccount.address,
          roleName:selectedAccount.roleName,
          isActive:statusToUpdate
        })

        // Update the rooms state
        setAccounts((prevAcc) =>
          prevAcc.map((acc) => (acc.id === selectedAccount.id ? { ...acc, isActive: statusToUpdate } : acc))
        )

        // Update temp status
        setTempStatus((prevTempStatus) => ({
          ...prevTempStatus,
          [selectedAccount.id]: statusToUpdate
        }))

        // Display success toast notification
        toast({
          variant: 'success',
          title: 'Updated successfully!',
          description: 'This account status has been changed to ' + (statusToUpdate ? 'Active' : 'Inactive')
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message || 'Please try again!'
          // Reset the temporary status if there's an error
          setTempStatus((prevTempStatus) => ({
            ...prevTempStatus,
            [selectedAccount.id]: selectedAccount.isActive
          }))
          // Display error toast notification
          toast({
            variant: 'destructive',
            title: 'Unable to update account status!',
            description: message
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }
  const handleEditName = (account: Account, currentName: string) => {}

  if (isLoadingAccounts) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Accounts list</h1>
      </div>
      <DataTable
        data={accounts}
        columns={columns(navigate, handleStatusChange, handleEditName, handleShowAmentiModal)}
        Toolbar={DataTableToolbar}
        rowString='Accounts'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Confirm status change</h3>
            <div className='mt-2'>
              <p>Are you sure you want to change the status of this account?</p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmStatusChange} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className='animate-spin' /> : 'Confirm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ListAllAccount
