import { useAuth } from '@/auth/AuthProvider'
import koiAPI from '@/lib/koiAPI'
import axios from 'axios'
import { Loader, Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/ui/button'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { toast } from '../../atoms/ui/use-toast'
import { DataTable } from '../table/main'
import TableSkeleton from '../TableSkeleton'
import { columns } from './columns'
import { DataTableToolbar } from './toolbar'
import CertificateModal from '../../molecules/CertificateModal'
import AddCertificateModal from '../../molecules/AddCertificateModal'

interface ApiResponse<T> {
  data: T
}
interface koiBreed {
  id: number
  name: string
  content: string
  imageUrl: string | null
  isDeleted: boolean
}
interface Certificate {
  id: number
  koiFishId: number
  certificateType: string
  certificateUrl: string
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
  koiCertificates: Certificate[]
  koiBreeds: koiBreed[]
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
  const [koiCertificatesModalVisible, setKoiCertificatesModalVisible] = useState(false)
  const [koiAddCertificatesModalVisible, setKoiAddCertificatesModalVisible] = useState(false)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [selectedCertificateId, setSelectedCertificateId] = useState<number | null>(null)
  const [deleletCertificateLoading, setDeleteCertificateLoading] = useState(false)
  const handleShowCertificateModal = (fish: Fish) => {
    setSelectedFish(fish)
    setKoiCertificatesModalVisible(true)
  }
  const handleCertificateModalOk = () => {
    setKoiCertificatesModalVisible(false)
  }
  const handleShowAddCertificateModal = () => {
    setKoiAddCertificatesModalVisible(true)
  }
  const handleAddCertificateModalOk = () => {
    setKoiAddCertificatesModalVisible(false)
  }
  const handleAddCertificate = (certificateData: {
    koiFishId: number
    certificateType: string
    certificateUrl: string
    id: number
  }) => {
    if (selectedFish) {
      // Update selectedFish's koiCertificates array with the new certificate
      const updatedFish = {
        ...selectedFish,
        koiCertificates: [
          ...selectedFish.koiCertificates,
          {
            id: certificateData.id,
            koiFishId: certificateData.koiFishId,
            certificateType: certificateData.certificateType,
            certificateUrl: certificateData.certificateUrl
          }
        ]
      }
      setSelectedFish(updatedFish)

      // Optionally, update the fishes list as well if needed
      setFishes((prevFishes) => prevFishes.map((fish) => (fish.id === selectedFish.id ? updatedFish : fish)))
    }
  }
  const handleDeleteCertificate = (certificateId: number) => {
    console.log("chon de xoa", certificateId)
    setSelectedCertificateId(certificateId)
    setIsDeleteConfirmModalOpen(true)
  }
  const onDeleteCertificate = async () => {
    if (!selectedCertificateId) return
    try {
      setDeleteCertificateLoading(true);
    const response=  await koiAPI.delete(`/api/v1/koi-certificates/${selectedCertificateId}`)
      console.log("dây", response)
      if (selectedFish) {
        const updatedCertificates = selectedFish.koiCertificates.filter((cert) => cert.id !== selectedCertificateId)
        const updatedFish = { ...selectedFish, koiCertificates: updatedCertificates }
        setSelectedFish(updatedFish)
        setFishes((prevFishes) => prevFishes.map((fish) => (fish.id === selectedFish.id ? updatedFish : fish)))
        toast({
          variant: 'success',
          title: 'Certificate deleted',
          description: 'The certificate was successfully removed.'
        })
      }
    } catch (error) {
      console.error('Error deleting certificate:', error)
      toast({
        variant: 'destructive',
        title: 'Error deleting certificate',
        description: 'Could not delete the certificate. Please try again.'+error
      })
    } finally {
      setDeleteCertificateLoading(false)
      setIsDeleteConfirmModalOpen(false)
      setSelectedCertificateId(null)
    }
  }
 
  useEffect(() => {
    const fetchAllFishes = async () => {
      setIsLoadingFishes(true)
      try {
        const response = await koiAPI.get<ApiResponse<Fish[]>>(`/api/v1/koi-fishes?PageNumber=1&PageSize=999`)
        const result = response.data.data
        console.log('fishes', result)
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
        console.log('fish', selectedFish)
        console.log('fish breed', selectedFish.koiBreeds)
        const koiBreedIds = selectedFish.koiBreeds.map((breed) => breed.id)
        const statusToUpdate = newStatus !== undefined ? newStatus : selectedFish.isAvailableForSale
        await koiAPI.put(`/api/v1/koi-fishes/${selectedFish.id}`, {
          name: selectedFish.name,
          origin: selectedFish.origin,
          // gender: selectedFish.gender,
          gender: true,
          dob: selectedFish.dob,
          length: selectedFish.length,
          weight: selectedFish.weight,
          price: selectedFish.price,
          isSold: selectedFish.isSold,
          personalityTraits: selectedFish.personalityTraits,
          dailyFeedAmount: selectedFish.dailyFeedAmount,
          lastHealthCheck: selectedFish.lastHealthCheck,
          // isConsigned: selectedFish.isConsigned,
          // ownerId: selectedFish.ownerId,
          // koiCertificates: selectedFish.koiCertificates,
          isDeleted: false,
          koiBreedIds: koiBreedIds,
          // koiDiaries: selectedFish.koiDiaries,
          // owner: selectedFish.owner,
          imageUrls: [],
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
        <Button variant='outline_primary' onClick={() => navigate('/fishes/addFish')}>
          <Plus className='w-4 h-4 mr-1' /> Add Fish{' '}
        </Button>
      </div>
      <DataTable
        data={fishes}
        columns={columns(navigate, handleStatusChange, handleEditName, handleShowCertificateModal)}
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
      <CertificateModal
        visible={koiCertificatesModalVisible}
        onOk={handleCertificateModalOk}
        fish={selectedFish}
        onAddCertificate={handleShowAddCertificateModal}
        onDeleteCertificate={handleDeleteCertificate}
        // onUpdateService={handleUpdateCertificate} // Pass the update handler
      />
      <AddCertificateModal
        visible={koiAddCertificatesModalVisible}
        onOk={handleAddCertificateModalOk}
        onAddCertificate={handleAddCertificate}
        fishId={selectedFish?.id || 0}
      />

      {isDeleteConfirmModalOpen && (
        <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Confirm delete</h3>
            <p>Are you sure you want to delete this certificate?</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setIsDeleteConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button disabled={deleletCertificateLoading} onClick={onDeleteCertificate}>{deleletCertificateLoading && <Loader2 className='animate-spin'/>}Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ListAllFish
