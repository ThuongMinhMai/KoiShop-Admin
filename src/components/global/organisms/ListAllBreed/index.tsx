'use client';

// import { useAuth } from '@/auth/AuthProvider';
import koiAPI from '@/lib/koiAPI';
// import axios from 'axios';
// import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Button } from '../../atoms/ui/button';
// import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog';
// import { toast } from '../../atoms/ui/use-toast';
import { DataTable } from '../table/main';
import TableSkeleton from '../TableSkeleton';
import { columns } from './columns';
import { DataTableToolbar } from './toolbar';

interface ApiResponse<T> {
  data: T;
}

interface Breed {
  id: number;
  name: string;
  content: string;
  imageUrl: string;
  isDeleted: boolean;
}

function ListAllBreed() {
//   const { user } = useAuth();
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoadingBreed, setIsLoadingBreed] = useState(true);
  // const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // const [newStatus, setNewStatus] = useState<string>('');
  // const [tempStatus, setTempStatus] = useState<{ [key: number]: string }>({});

  // const handleShowOrderDetailsModal = (order: Order) => {
  //   // Additional code for handling modal display for order details
  // };

  useEffect(() => {
    const fetchAllBreed = async () => {
      setIsLoadingBreed(true);
      try {
        const response = await koiAPI.get<ApiResponse<Breed[]>>(`/api/v1/koi-breeds`);
        const result = response.data.data;

        setBreeds(result || []);

      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingBreed(false);
      }
    };

    fetchAllBreed();
  }, []);

  // const handleStatusChange = (order: Order, status: string) => {
  //   setSelectedOrder(order);
  //   setNewStatus(status);
  //   setIsModalOpen(true);
  // };

  // const confirmStatusChange = async () => {
  //   setIsLoadingUpdate(true);
  //   if (selectedOrder) {
  //     try {
  //       const statusToUpdate = newStatus || selectedOrder.orderStatus;

  //       await koiAPI.put(`/api/v1/orders/${selectedOrder.id}`, {
  //         ...selectedOrder,
  //         orderStatus: statusToUpdate
  //       });

  //       setOrders((prevOrders) =>
  //         prevOrders.map((ord) => (ord.id === selectedOrder.id ? { ...ord, orderStatus: statusToUpdate } : ord))
  //       );

  //       setTempStatus((prevTempStatus) => ({
  //         ...prevTempStatus,
  //         [selectedOrder.id]: statusToUpdate
  //       }));

  //       toast({
  //         variant: 'success',
  //         title: 'Updated successfully!',
  //         description: `Order status has been changed to ${statusToUpdate}`
  //       });
  //     } catch (error) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         const message = error.response.data.Result.message || 'Please try again!';
  //         setTempStatus((prevTempStatus) => ({
  //           ...prevTempStatus,
  //           [selectedOrder.id]: selectedOrder.orderStatus
  //         }));
  //         toast({
  //           variant: 'destructive',
  //           title: 'Unable to update order status!',
  //           description: message
  //         });
  //       }
  //     } finally {
  //       setIsLoadingUpdate(false);
  //       setIsModalOpen(false);
  //     }
  //   }
  // };

  // const handleEditOrderNote = (order: Order, currentNote: string) => {
  //   // Additional code for handling editing order notes
  // };

  if (isLoadingBreed) {
    return <TableSkeleton />;
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex justify-between">
        <h1 className="my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0">Breeds List</h1>
      </div>
      <DataTable
        data={breeds}
        columns={columns(navigate)}
        Toolbar={DataTableToolbar}
        rowString="Orders"
      />
      {/* {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="bg-/60" />
          <DialogContent>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Confirm status change</h3>
            <div className="mt-2">
              <p>Are you sure you want to change the status of this order?</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmStatusChange} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className="animate-spin" /> : 'Confirm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
}

export default ListAllBreed;
