import { Dialog, DialogContent, DialogOverlay } from '../../global/atoms/ui/dialog'
import { Button } from '../../global/atoms/ui/button'
import { useState } from 'react'
import { toast } from '../../global/atoms/ui/use-toast'
import { Input } from '../atoms/ui/input'
import koiAPI from '@/lib/koiAPI'

interface AddCertificateModalProps {
  visible: boolean
  onOk: () => void
  onAddCertificate: (certificateData: {
    id: number
    koiFishId: number
    certificateType: string
    certificateUrl: string
  }) => void
  fishId: number
}

const AddCertificateModal = ({ visible, onOk, onAddCertificate, fishId }: AddCertificateModalProps) => {
  const [certificateType, setCertificateType] = useState('')
  const [certificateUrl, setCertificateUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const resetFields = () => {
    setCertificateType('')
    setCertificateUrl('')
  }

  const handleSubmit = async () => {
    if (!certificateType || !certificateUrl) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields' })
      return
    }
    setLoading(true)

    // console.log({ koiFishId: fishId, certificateType, certificateUrl })

    // onAddCertificate({id:0, koiFishId: fishId, certificateType, certificateUrl })
    // onOk()
    try {
      // Replace '/api/certificates' with your actual API endpoint
      const response = await koiAPI.post('/api/v1/koi-certificates', {
        koiFishId: fishId,
        certificateType,
        certificateUrl
      })

      // Assuming response.data contains the created certificate
      onAddCertificate(response.data)
      toast({ title: 'Success', description: 'Certificate added successfully!' })
      onOk()
      resetFields()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add certificate' + error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={visible}
      onOpenChange={() => {
        onOk()
        resetFields()
      }}
    >
      <DialogContent>
        <h3 className='text-lg font-medium leading-6 text-primary'>Add Certificate</h3>
        <div className='mt-2'>
          <Input
            placeholder='Certificate Type'
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
          />
          <Input
            placeholder='Certificate URL'
            value={certificateUrl}
            onChange={(e) => setCertificateUrl(e.target.value)}
            className='mt-2'
          />
        </div>
        <div className='mt-4 flex justify-end space-x-2'>
          <Button
            variant='secondary'
            onClick={() => {
              onOk()
              resetFields()
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Certificate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCertificateModal
