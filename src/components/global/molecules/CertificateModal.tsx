import { Dialog, DialogContent, DialogOverlay } from '../../global/atoms/ui/dialog'
import { Button } from '../../global/atoms/ui/button'
import { Plus, Trash } from 'lucide-react'
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
interface CertificateModalProps {
  visible: boolean
  onOk: () => void
  fish: Fish | null
  onAddCertificate: () => void
  onDeleteCertificate: (certificateId: number) => void
}

const CertificateModal = ({ visible, onOk, fish, onAddCertificate, onDeleteCertificate }: CertificateModalProps) => {
    console.log("cer", fish?.koiCertificates)
  return (
    <Dialog open={visible} onOpenChange={onOk}>
      <DialogOverlay className='bg-gray-300 opacity-60' />
      <DialogContent>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-medium leading-6 text-primary'>Certificates's {fish?.name}</h3>
          <Button variant='outline_primary' onClick={onAddCertificate}>
            <Plus className='w-4 h-4' />
            Certificate
          </Button>
        </div>

        <div className='mt-2 space-y-4 max-h-96 overflow-y-auto'>
          {fish?.koiCertificates?.length ? (
            fish.koiCertificates.map((certificate) => (
              //   <div key={certificate.id} className='p-2 border rounded-md'>
              //     <h4 className='font-semibold'>{certificate.certificateType}</h4>
              //     <img className='' src={certificate.certificateUrl}/>
              //   </div>
              <div key={certificate.id} className='p-2 border rounded-md flex flex-col justify-between items-center'>
                <div className='flex justify-between w-full items-center'>
                  <h4 className='font-semibold'>{certificate.certificateType}</h4>
                  <button
                    onClick={() => onDeleteCertificate(certificate.id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash className='w-5 h-5' />
                  </button>
                </div>
                <img className='mt-2' src={certificate.certificateUrl} alt={certificate.certificateType} />
              </div>
            ))
          ) : (
            <p>No certificates available for this fish.</p>
          )}
        </div>
        <div className='mt-4 flex justify-end space-x-2'>
          <Button variant='outline' onClick={onOk}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CertificateModal
