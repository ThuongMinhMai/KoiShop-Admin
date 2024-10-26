import axios from 'axios';
import koiAPI from '@/lib/koiAPI';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export interface IUserDetail {
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
interface ApiResponse<T> {
  data: T
}
// export const fetchUserDetail = async (userId: string): Promise<IUserDetail> => {
//   const { data } = await busAPI.get<IUserDetail>(`/user-management/managed-users/${userId}/details`);
//   return data;
// };
export const fetchUserDetail = (userId: number) => {
    return useQuery({
      queryKey: ['userDetail', userId],
      queryFn: async () => {
        const response = await koiAPI.get<ApiResponse<IUserDetail>>(`/api/v1/users/${userId}`);
        console.log("tui ne", response.data.data)
        return response.data.data;
      },
    });
  };
  export const updateUserProfile = async (userId:number,formData: any) => {
    try {
      const response = await koiAPI.put(`/uapi/v1/users/${userId}`, formData); // Adjust the API endpoint and method as per your backend API
      return response.data; // Assuming the API returns updated user data
    } catch (error) {
      throw new Error('Error updating user profile'); // Handle errors appropriately in your application
    }
  };