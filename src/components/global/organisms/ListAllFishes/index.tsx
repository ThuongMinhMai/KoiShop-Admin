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
  koiDiaries: object
  owner: object
}

function ListAllFish() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [fishes, setFishes] = useState<Fish[]>([])
  const [isLoadingFishes, setIsLoadingFishes] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null)
  const [newStatus, setNewStatus] = useState<boolean>()
  const [tempStatus, setTempStatus] = useState<{ [key: string]: boolean }>({})
  const handleShowAmentiModal = (fish: Fish) => {}

  useEffect(() => {
    const fetchAllFishes = async () => {
      setIsLoadingFishes(true)
      try {
        const response = await koiAPI.get<ApiResponse<Fish[]>>(`/api/v1/koi-fishes`)
        const result = response.data.data
        console.log("fishes", result)
        const filteredFishes = result.filter((fish: Fish) => fish.koiBreeds !== null)
        setFishes(filteredFishes || [])
        const initialStatuses: { [key: string]: boolean } = {}
        result.forEach((fish: Fish) => {
          initialStatuses[fish.id] = fish.isAvailableForSale
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingFishes(false)
      }
    }
    fetchAllFishes()
  }, [user?.id])

  const handleStatusChange = (fish: Fish, status: boolean) => {
    setSelectedFish(fish)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedFish) {
      try {
        console.log('new status', newStatus)
        console.log("fish", selectedFish)
        const statusToUpdate = newStatus !== undefined ? newStatus : selectedFish.isAvailableForSale
        await koiAPI.put(`/api/v1/koi-fishes/${selectedFish.id}`, {
          name: selectedFish.name,
          origin: selectedFish.origin,
          gender: selectedFish.gender,
          dob: selectedFish.dob,
          length: selectedFish.length,
          weight: selectedFish.weight,
          price: selectedFish.price,
          isSold: selectedFish.isSold,
          personalityTraits: selectedFish.personalityTraits,
          dailyFeedAmount: selectedFish.dailyFeedAmount,
          lastHealthCheck: selectedFish.lastHealthCheck,
          isConsigned: selectedFish.isConsigned,
          ownerId: selectedFish.ownerId,
          koiCertificates: selectedFish.koiCertificates,
          koiBreeds: selectedFish.koiBreeds,
          koiDiaries: selectedFish.koiDiaries,
          owner: selectedFish.owner,
          isAvailableForSale: statusToUpdate          
        })
        setFishes((prevFish) =>
          prevFish.map((fish) => (fish.id === selectedFish.id ? { ...fish, isAvailableForSale: statusToUpdate } : fish))
        )
        setTempStatus((prevTempStatus) => ({
          ...prevTempStatus,
          [selectedFish.id]: statusToUpdate
        }))
        toast({
          variant: 'success',
          title: 'Updated successfully!',
          description: 'This fish status has been changed to ' + (statusToUpdate ? 'Available' : 'Not Available')
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message || 'Please try again!'
          setTempStatus((prevTempStatus) => ({
            ...prevTempStatus,
            [selectedFish.id]: selectedFish.isAvailableForSale
          }))
          toast({
            variant: 'destructive',
            title: 'Unable to update fish status!',
            description: message
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }

  const handleEditName = (fish: Fish, currentName: string) => {}

  if (isLoadingFishes) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Fish list</h1>
      </div>
      <DataTable
        data={fishes}
        columns={columns(navigate, handleStatusChange, handleEditName, handleShowAmentiModal)}
        Toolbar={DataTableToolbar}
        rowString='Fish'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Confirm status change</h3>
            <div className='mt-2'>
              <p>Are you sure you want to change the status of this fish?</p>
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

export default ListAllFish
