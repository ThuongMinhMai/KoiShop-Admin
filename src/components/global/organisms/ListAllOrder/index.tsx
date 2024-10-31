'use client'

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
import { formatPrice } from '@/lib/utils'

interface ApiResponse<T> {
  data: T
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

function ListAllOrder() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: number]: string }>({})
  const [fishDetails, setFishDetails] = useState<{ [key: number]: any }>({})
  const [isFishDetailsLoading, setIsFishDetailsLoading] = useState(false)

  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoadingOrders(true)
      try {
        const response = await koiAPI.get<ApiResponse<Order[]>>(`/api/v1/orders`)
        const result = response.data.data

        setOrders(result || [])

        const initialStatuses: { [key: number]: string } = {}
        result.forEach((order: Order) => {
          initialStatuses[order.id] = order.orderStatus
        })

        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingOrders(false)
      }
    }

    fetchAllOrders()
  }, [])

  const handleStatusChange = (order: Order, status: string) => {
    setSelectedOrder(order)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const fetchFishDetails = async (koiFishId: number) => {
    try {
      const response = await koiAPI.get<ApiResponse<any>>(`/api/v1/koi-fishes/${koiFishId}`)
      setFishDetails((prevDetails) => ({
        ...prevDetails,
        [koiFishId]: response.data.data
      }))
    } catch (error) {
      console.log(`Error fetching details for KoiFishId: ${koiFishId}`, error)
    }
  }

  const handleShowOrderDetailsModal = (order: Order) => {
    setSelectedOrder(order)
    setIsModalDetailOpen(true)
    setIsFishDetailsLoading(true)
    order.orderDetails.forEach((detail: any) => {
      fetchFishDetails(detail.koiFishId)
    })
    setIsFishDetailsLoading(false)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedOrder) {
      try {
        await koiAPI.put(`/api/v1/cancel-order/${selectedOrder.id}`)

        setOrders((prevOrders) =>
          prevOrders.map((ord) => (ord.id === selectedOrder.id ? { ...ord, orderStatus: 'REFUNDED' } : ord))
        )

        setTempStatus((prevTempStatus) => ({
          ...prevTempStatus,
          [selectedOrder.id]: 'REFUNDED'
        }))

        toast({
          variant: 'success',
          title: 'Updated successfully!',
          description: `Order status has been changed to REFUNDED.`
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message || 'Please try again!'
          setTempStatus((prevTempStatus) => ({
            ...prevTempStatus,
            [selectedOrder.id]: selectedOrder.orderStatus
          }))
          toast({
            variant: 'destructive',
            title: 'Unable to update order status!',
            description: message
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }

  if (isLoadingOrders) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Orders List</h1>
      </div>
      <DataTable
        data={orders}
        columns={columns(navigate, handleStatusChange, handleShowOrderDetailsModal)}
        Toolbar={DataTableToolbar}
        rowString='Orders'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Are you sure cancel order?</h3>
            <div className='mt-2'>
              <p>Are you sure you want to change status order to cancel?</p>
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
      {isModalDetailOpen && selectedOrder && (
        <Dialog open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen}>
          <DialogOverlay className='bg-/60' />
          {isFishDetailsLoading ? (
            <DialogContent className='flex-1 '>
              <Loader />
            </DialogContent>
          ) : (
            <DialogContent>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>Order Details</h3>
              <div className='mt-4 space-y-2'>
                <p>
                  <strong>User Name:</strong> {selectedOrder.userName}
                </p>
                <p>
                  <strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}
                </p>
                <p>
                  <strong>Total Amount:</strong> {formatPrice(selectedOrder.totalAmount)}
                </p>
                <p>
                  <strong>Order Status:</strong> {selectedOrder.orderStatus}
                </p>
                <p>
                  <strong>Shipping Address:</strong> {selectedOrder.shippingAddress}
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Note:</strong> {selectedOrder.note}
                </p>
                <h4 className='mt-4 text-lg font-semibold'>Order Details:</h4>
                <ul>
                  {selectedOrder.orderDetails.map((detail, index) => (
                    <li key={index} className='ml-4 flex flex-col gap-y-3 border p-2'>
                      {fishDetails[detail.koiFishId] && (
                        <div className='flex w-full justify-around'>
                          <img
                            className='h-30 w-14 rounded-lg'
                            src={
                              fishDetails[detail.koiFishId].koiFishImages.length === 0
                                ? 'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg'
                                : fishDetails[detail.koiFishId].koiFishImages[0]
                            }
                          />
                          <div>
                            <p>
                              <strong>Name:</strong> {fishDetails[detail.koiFishId].name}
                            </p>
                            <p>
                              <strong>Origin:</strong> {fishDetails[detail.koiFishId].origin}
                            </p>
                            <p>
                              <strong>Gender:</strong> {fishDetails[detail.koiFishId].gender}
                            </p>
                            <p>
                              <strong>Date of Birth:</strong>{' '}
                              {new Date(fishDetails[detail.koiFishId].dob).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Length:</strong> {fishDetails[detail.koiFishId].length} cm
                            </p>
                            <p>
                              <strong>Weight:</strong> {fishDetails[detail.koiFishId].weight} g
                            </p>
                          </div>
                        </div>
                      )}
                      <div className='flex flex-col items-end'>
                        <p>
                          <strong>Price:</strong> {formatPrice(detail.price)}
                        </p>
                        <p>
                          <strong>Status:</strong> {detail.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-4 flex justify-end'>
                <Button onClick={() => setIsModalDetailOpen(false)} variant='secondary'>
                  Close
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
      )}
    </div>
  )
}

export default ListAllOrder
