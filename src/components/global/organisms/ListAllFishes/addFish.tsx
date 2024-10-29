// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import '../style/FormEdit.css';

// interface Fish {
//   id: number;
//   name: string;
//   origin: string;
//   gender: string;
//   dob: string;
//   length: number;
//   weight: number;
//   personalityTraits: string;
//   dailyFeedAmount: number;
//   lastHealthCheck: Date;
//   isAvailableForSale: boolean;
//   price: number;
//   isConsigned: boolean;
//   isSold: boolean;
//   ownerId: number;
//   koiCertificates: object;
//   koiBreeds: object;
// }

// interface ErrorState {
//   name_err: string;
//   origin_err: string;
//   gender_err: string;
//   dob_err: string;
//   length_err: string;
//   weight_err: string;
//   personalityTraits_err: string;
//   dailyFeedAmount_err: string;
//   lastHealthCheck_err: string;
//   isAvailableForSale_err: string;
//   price_err: string;
//   isConsigned_err: string;
//   isSold_err: string;
//   ownerId_err: string;
//   koiCertificates_err: string;
//   koiBreeds_err: string;
// }

// const URL = '/api/v1/koi-fishes'; // Update to your actual endpoint
// const initialState: Fish = {
//     id: Date.now(),
//     name: '',
//     origin: '',
//     gender: '',
//     dob: '',
//     length: 0,
//     weight: 0,
//     personalityTraits: '',
//     dailyFeedAmount: 0,
//     lastHealthCheck: new Date(),
//     isAvailableForSale: false,
//     price: 0,
//     isConsigned: false,
//     isSold: false,
//     ownerId: 0,
//     koiCertificates: {},
//     koiBreeds: {}
// };
// const errorInit: ErrorState = {
//     name_err: '',
//     origin_err: '',
//     gender_err: '',
//     dob_err: '',
//     length_err: '',
//     weight_err: '',
//     personalityTraits_err: '',
//     dailyFeedAmount_err: '',
//     lastHealthCheck_err: '',
//     isAvailableForSale_err: '',
//     price_err: '',
//     isConsigned_err: '',
//     isSold_err: '',
//     ownerId_err: '',
//     koiCertificates_err: '',
//     koiBreeds_err: ''
// };

// const AddFishForm: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [state, setState] = useState<Fish>(initialState);
//     const [errors, setErrors] = useState<ErrorState>(errorInit);

//     useEffect(() => {
//         if (id) getOneFish(id);
//     }, [id]);

//     const getOneFish = async (id: string) => {
//         const res = await axios.get(`${URL}/${id}`);
//         if (res.status === 200) {
//             setState(res.data);
//         }
//     };

//     const updateFish = async (id: string, data: Fish) => {
//         const res = await axios.put(`${URL}/${id}`, data);
//         if (res.status === 200) {
//             toast.success(`Updated Fish with ID: ${id} successfully!`);
//             navigate('/dashboard');
//         }
//     };

//     const addNewFish = async (data: Fish) => {
//         const res = await axios.post(URL, data);
//         if (res.status === 200 || res.status === 201) {
//             toast.success("New Fish has been added successfully!");
//             navigate('/dashboard');
//         }
//     };

//     const validateForm = (): boolean => {
//         let isValid = true;
//         let errors = { ...errorInit };

//         if (state.name.trim() === '') {
//             errors.name_err = 'Name is required';
//             isValid = false;
//         }
//         if (state.origin.trim() === '') {
//             errors.origin_err = 'Origin is required';
//             isValid = false;
//         }
//         if (state.gender.trim() === '') {
//             errors.gender_err = 'Gender is required';
//             isValid = false;
//         }
//         if (state.dob.trim() === '') {
//             errors.dob_err = 'Date of Birth is required';
//             isValid = false;
//         }
//         if (state.length <= 0) {
//             errors.length_err = 'Length must be greater than 0';
//             isValid = false;
//         }
//         if (state.weight <= 0) {
//             errors.weight_err = 'Weight must be greater than 0';
//             isValid = false;
//         }
//         if (state.personalityTraits.trim() === '') {
//             errors.personalityTraits_err = 'Personality Traits are required';
//             isValid = false;
//         }
//         if (state.dailyFeedAmount <= 0) {
//             errors.dailyFeedAmount_err = 'Daily Feed Amount must be greater than 0';
//             isValid = false;
//         }
//         if (state.price <= 0) {
//             errors.price_err = 'Price must be greater than 0';
//             isValid = false;
//         }
//         setErrors(errors);
//         return isValid;
//     };

//     const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if (validateForm()) {
//             if (id) updateFish(id, state);
//             else addNewFish(state);
//         } else {
//             toast.error("Some info is invalid. Please check again.");
//         }
//     };

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         let { name, value } = event.target;
//         setState((state) => ({ ...state, [name]: value }));
//     };

//     return (
//         <div className='container-edit'>
//             <div className="form-edit">
//                 <h2>{id ? "Update Form" : "Add New Fish"}</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <label htmlFor="name">Name: </label>
//                         <input type="text" name='name' value={state.name} onChange={handleInputChange} />
//                         {errors.name_err && <span className='error'>{errors.name_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="origin">Origin: </label>
//                         <input type="text" name='origin' value={state.origin} onChange={handleInputChange} />
//                         {errors.origin_err && <span className='error'>{errors.origin_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="gender">Gender: </label>
//                         <input type="text" name='gender' value={state.gender} onChange={handleInputChange} />
//                         {errors.gender_err && <span className='error'>{errors.gender_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="dob">Date of Birth: </label>
//                         <input type="date" name='dob' value={state.dob} onChange={handleInputChange} />
//                         {errors.dob_err && <span className='error'>{errors.dob_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="length">Length (cm): </label>
//                         <input type="number" name='length' value={state.length} onChange={handleInputChange} />
//                         {errors.length_err && <span className='error'>{errors.length_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="weight">Weight (g): </label>
//                         <input type="number" name='weight' value={state.weight} onChange={handleInputChange} />
//                         {errors.weight_err && <span className='error'>{errors.weight_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="personalityTraits">Personality Traits: </label>
//                         <input type="text" name='personalityTraits' value={state.personalityTraits} onChange={handleInputChange} />
//                         {errors.personalityTraits_err && <span className='error'>{errors.personalityTraits_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="dailyFeedAmount">Daily Feed Amount (g): </label>
//                         <input type="number" name='dailyFeedAmount' value={state.dailyFeedAmount} onChange={handleInputChange} />
//                         {errors.dailyFeedAmount_err && <span className='error'>{errors.dailyFeedAmount_err}</span>}
//                     </div>
//                     <div>
//                         <label htmlFor="price">Price: </label>
//                         <input type="number" name='price' value={state.price} onChange={handleInputChange} />
//                         {errors.price_err && <span className='error'>{errors.price_err}</span>}
//                     </div>

//                         <label htmlFor="isAvailableForSale">Available for Sale: </label>
//                         <input type="checkbox" name='isAvailableForSale' checked={state.isAvailableForSale} onChange={handleInputChange} />
//                         {errors.isAvailableForSale_err && <span className='error'>{errors.isAvailableForSale_err}</span>}
//                         <div>
//                            <label htmlFor="isConsigned">Consigned: </label>
//                            <input type="checkbox" name='isConsigned' checked={state.isConsigned} onChange={handleInputChange} />
//                            {errors.isConsigned_err && <span className='error'>{errors.isConsigned_err}</span>}
//                        </div>
//                        <div>
//                            <label htmlFor="isSold">Sold: </label>
//                            <input type="checkbox" name='isSold' checked={state.isSold} onChange={handleInputChange} />
//                            {errors.isSold_err && <span className='error'>{errors.isSold_err}</span>}
//                        </div>
//                        <div>
//                            <label htmlFor="ownerId">Owner ID: </label>
//                            <input type="number" name='ownerId' value={state.ownerId} onChange={handleInputChange} />
//                            {errors.ownerId_err && <span className='error'>{errors.ownerId_err}</span>}
//                        </div>
//                        <button type='submit' className='form-button'>{id ? "Update" : "Submit"}</button>
//                    </form>
//                </div>
//            </div>
//        );
//    };

//    export default AddFishForm;

import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../atoms/ui/use-toast' // Adjust the import path accordingly
import koiAPI from '@/lib/koiAPI'

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

const AddFishForm: React.FC = () => {
  const tokenHeader = localStorage.getItem('tokenHeader')
  const navigate = useNavigate()
  const [newFish, setNewFish] = useState<Fish>({
    id: Date.now(),
    name: '',
    origin: '',
    gender: '',
    dob: '',
    length: 0,
    weight: 0,
    personalityTraits: '',
    dailyFeedAmount: 0,
    lastHealthCheck: new Date(),
    isAvailableForSale: false,
    price: 0,
    isConsigned: false,
    isSold: false,
    ownerId: 0,
    koiCertificates: {},
    koiBreeds: {}
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setNewFish((prevFish) => ({
      ...prevFish,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Hi')
    e.preventDefault()
    console.log('hehe', tokenHeader)

    try {
      const response = await koiAPI.post('/api/v1/koi-fishes', newFish, {
        headers: {
          Authorization: `Bearer ${tokenHeader}`,
        },
      });
      console.log(response.data)
      toast({
        variant: 'success',
        title: 'Fish Added',
        description: 'The fish has been added successfully!'
      })
      navigate('/fishes')
    } catch (error) {
      console.error('Error adding fish:', error)
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || 'An unexpected error occurred'
        const statusCode = error.response?.status || 'No status code'
        toast({ variant: 'destructive', title: `Error ${statusCode}`, description: serverMessage })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an issue adding the fish. Please try again.'
        })
      }
    }
  }
  return (
    <form id='addFishForm' onSubmit={handleSubmit}>
      <label htmlFor='name'>Name:</label>
      <input type='text' id='name' name='name' value={newFish.name} onChange={handleInputChange} />
      <br />

      <label htmlFor='origin'>Origin:</label>
      <input type='text' id='origin' name='origin' value={newFish.origin} onChange={handleInputChange} />
      <br />

      <label htmlFor='gender'>Gender:</label>
      <input type='text' id='gender' name='gender' value={newFish.gender} onChange={handleInputChange} />
      <br />

      <label htmlFor='dob'>Date of Birth:</label>
      <input type='date' id='dob' name='dob' value={newFish.dob} onChange={handleInputChange} />
      <br />

      <label htmlFor='length'>Length (cm):</label>
      <input type='number' id='length' name='length' value={newFish.length} onChange={handleInputChange} />
      <br />

      <label htmlFor='weight'>Weight (g):</label>
      <input type='number' id='weight' name='weight' value={newFish.weight} onChange={handleInputChange} />
      <br />

      <label htmlFor='personalityTraits'>Personality Traits:</label>
      <input
        type='text'
        id='personalityTraits'
        name='personalityTraits'
        value={newFish.personalityTraits}
        onChange={handleInputChange}
      />
      <br />

      <label htmlFor='dailyFeedAmount'>Daily Feed Amount (g):</label>
      <input
        type='number'
        id='dailyFeedAmount'
        name='dailyFeedAmount'
        value={newFish.dailyFeedAmount}
        onChange={handleInputChange}
      />
      <br />

      <label htmlFor='lastHealthCheck'>Last Health Check:</label>
      <input
        type='date'
        id='lastHealthCheck'
        name='lastHealthCheck'
        value={newFish.lastHealthCheck.toISOString().substring(0, 10)}
        onChange={handleInputChange}
      />
      <br />

      <label htmlFor='isAvailableForSale'>Available for Sale:</label>
      <input
        type='checkbox'
        id='isAvailableForSale'
        name='isAvailableForSale'
        checked={newFish.isAvailableForSale}
        onChange={handleInputChange}
      />
      <br />

      <label htmlFor='price'>Price:</label>
      <input type='number' id='price' name='price' value={newFish.price} onChange={handleInputChange} />
      <br />

      <label htmlFor='isConsigned'>Consigned:</label>
      <input
        type='checkbox'
        id='isConsigned'
        name='isConsigned'
        checked={newFish.isConsigned}
        onChange={handleInputChange}
      />
      <br />

      <label htmlFor='isSold'>Sold:</label>
      <input type='checkbox' id='isSold' name='isSold' checked={newFish.isSold} onChange={handleInputChange} />
      <br />

      <label htmlFor='ownerId'>Owner ID:</label>
      <input type='number' id='ownerId' name='ownerId' value={newFish.ownerId} onChange={handleInputChange} />
      <br />

      <button type='submit'>Add Fish</button>
    </form>
  )
}

export default AddFishForm
