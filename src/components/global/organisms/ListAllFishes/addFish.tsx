import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../../atoms/ui/use-toast'
import koiAPI from '@/lib/koiAPI'
import './addFishForm.css'
import { ArrowLeft } from 'lucide-react'
import { isDataView } from 'util/types'
import { boolean } from 'zod'
import { Button } from '../../atoms/ui/button'
import { previousDay } from 'date-fns'

interface Fish {
  id: number
  name: string
  origin: string
  gender: string | boolean
  dob: Date
  length: number
  weight: number
  isAvailableForSale: boolean
  price: number
  isSold: boolean
  personalityTraits: string
  dailyFeedAmount: number
  lastHealthCheck: Date
  koiBreedIds: number[]
  koiCertificates: (string | null)[]
  imageUrls: (string | null)[]
}

interface KoiBreed {
  id: number
  name: string
  content: string
  imageUrl: string
  isDeleted: boolean
}

const AddFishForm: React.FC = () => {
  const { id } = useParams()
  const tokenHeader = localStorage.getItem('tokenHeader')
  const navigate = useNavigate()
  const [newFish, setNewFish] = useState<Fish>({
    id: Date.now(),
    name: '',
    origin: '',
    gender: '',
    dob: new Date(),
    length: 0,
    weight: 0,
    isAvailableForSale: false,
    price: 0,
    isSold: false,
    personalityTraits: '',
    dailyFeedAmount: 0,
    lastHealthCheck: new Date(),
    koiBreedIds: [],
    koiCertificates: [null],
    imageUrls: []
  })
  const [fishData, setFishData] = useState({
    name: '',
    origin: '',
    gender: null,
    dob: new Date(),
    length: 0,
    weight: 0,
    isAvailableForSale: false,
    price: 0,
    isSold: false,
    personalityTraits: '',
    dailyFeedAmount: 0,
    lastHealthCheck: new Date(),
    koiBreedIds: [],
    imageUrls: [],
    isDeleted: false
  })

  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [newKoiCertificate, setNewKoiCertificate] = useState<string>('')
  const [newImageUrl, setNewImageUrl] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newKoiBreedIds, setNewKoiBreedIds] = useState([])

  useEffect(() => {
    const fetchKoiBreeds = async () => {
      try {
        const response = await koiAPI.get('/api/v1/koi-breeds')
        console.log("fetch koi breed", response.data.data);
        setKoiBreeds(response.data.data)
        console.log('koi breeds:', response.data.data)
      } catch (error) {
        console.error('Error fetching koi breeds:', error)
      }
    }

    const fetchFish = async () => {
      try {
        const response = await koiAPI.get(`/api/v1/koi-fishes/${id}`)
        console.log("gion ne",response.data.data.koiBreeds,response.data.data.koiBreeds[0].id,response.data.data.koiBreeds[1])
        setFishData({
          name: response.data.data.name || '',
          origin: response.data.data.origin || '',
          gender: response.data.data.gender === 'Male' ? true : false,
          dob: response.data.data.dob ? new Date(response.data.data.dob) : new Date(),
          length: response.data.data.length || 0,
          weight: response.data.data.weight || 0,
          isAvailableForSale: response.data.data.isAvailableForSale || false,
          price: response.data.data.price || 0,
          isSold: response.data.data.isSold || false,
          personalityTraits: response.data.data.personalityTraits || '',
          dailyFeedAmount: response.data.data.dailyFeedAmount || 0,
          lastHealthCheck: response.data.data.lastHealthCheck
            ? new Date(response.data.data.lastHealthCheck)
            : new Date(),
          koiBreedIds: response.data.data.koiBreeds || [],
          imageUrls: response.data.data.koiFish || [],
          isDeleted: false
        })

        console.log('gioi tinh', response.data.data.gender)
        console.log('fish data:', response.data.data)
      } catch (error) {
        console.error('Error fetching breed data:', error)
      }
    }

    fetchFish()
    fetchKoiBreeds()
  }, [])

  const handleChange = (e: any) => {
    setFishData({
      ...fishData,
      [e.target.name]: e.target.value
    })
  }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   // if (id) {
  //   //   const { name, value, type } = e.target
  //   //   // Type guard for HTMLInputElement
  //   //   if (e.target instanceof HTMLInputElement) {
  //   //     const inputValue =
  //   //       type === 'checkbox'
  //   //         ? e.target.checked
  //   //         : name === 'dob' || name === 'lastHealthCheck'
  //   //           ? new Date(value)
  //   //           : name === 'gender'
  //   //           ? value.toLowerCase()  === 'male'
  //   //           : value
  //   //     setFishData({
  //   //       ...fishData,
  //   //       [e.target.name]: e.target.value
  //   //     })
  //   //   } else if (e.target instanceof HTMLSelectElement) {
  //   //     const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value))
  //   //     setFishData({
  //   //       ...fishData,
  //   //       [e.target.name]: selectedOptions
  //   //     })
  //   //   }
  //   // } else {
  //   const { name, value, type } = e.target
  //   // Type guard for HTMLInputElement
  //   if (e.target instanceof HTMLInputElement) {
  //     const inputValue =
  //       type === 'checkbox' ? e.target.checked : name === 'dob' || name === 'lastHealthCheck' ? new Date(value) : value
  //     setNewFish((prevFish) => ({
  //       ...prevFish,
  //       [name]: inputValue
  //     }))
  //   } else if (e.target instanceof HTMLSelectElement) {
  //     const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value))
  //     setNewFish((prevFish) => ({
  //       ...prevFish,
  //       [name]: selectedOptions
  //     }))
  //   }
  //   // }
  // }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let inputValue: any
    if (e.target instanceof HTMLInputElement) {
      if (type === 'checkbox') {
        inputValue = e.target.checked
      } else if (name === 'dob' || name === 'lastHealthCheck') {
        inputValue = new Date(value)
      } else if (name === 'price') {
        inputValue = parseFloat(value)
      } else {
        inputValue = value
      }
      setNewFish((prevFishData) => ({ ...prevFishData, [name]: inputValue }))
    } else if (e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value))
      setNewFish((prevFishData) => ({ ...prevFishData, [name]: selectedOptions }))
    }
  }
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let inputValue: any = value

    if (type === 'checkbox') {
      inputValue = e.target.checked
    } else if (name === 'dob' || name === 'lastHealthCheck') {
      inputValue = new Date(value)
    } else if (name === 'gender') {
      inputValue = value === 'true'
    } else if (name === 'length' || name === 'weight' || name === 'price' || name === 'dailyFeedAmount') {
      // Parse the value as a number if the field requires it
      inputValue = parseFloat(value) || 0 // default to 0 if value is NaN
    }

    setFishData((prev) => ({ ...prev, [name]: inputValue }))
  }
  const addKoiCertificate = () => {
    setNewFish((prevFish) => ({
      ...prevFish,
      koiCertificates: prevFish.koiCertificates.some((cert) => cert === null)
        ? [newKoiCertificate]
        : [...prevFish.koiCertificates, newKoiCertificate]
    }))
    setNewKoiCertificate('')
  }

  const addImageUrl = () => {
    setNewFish((prevFish) => ({
      ...prevFish,
      imageUrls: prevFish.imageUrls.some((url) => url === null) ? [newImageUrl] : [...prevFish.imageUrls, newImageUrl]
    }))
    setNewImageUrl('')
  }
  const handleSelectChange = (e:any, index:any) => {
    const selectedValue = Number(e.target.value);
    const updatedKoiBreedIds = [...newFish.koiBreedIds];

    if (index < updatedKoiBreedIds.length) {
      updatedKoiBreedIds[index] = selectedValue;
    } else {
      updatedKoiBreedIds.push(selectedValue);
    }

    setNewFish({ ...newFish, koiBreedIds: updatedKoiBreedIds });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('value udate', fishData)
    try {
      if (id) {
        fishData.koiBreedIds = fishData.koiBreedIds.map(breed => breed.id);
        await koiAPI.put(`/api/v1/koi-fishes/${id}`, fishData)
        toast({
          variant: 'success',
          title: 'Fish Updated',
          description: 'The fish has been update successfully!'
        })
        setTimeout(() => navigate('/fishes'), 1000)
      } else {
        console.log("id bred", newFish.koiBreedIds)
        const response = await koiAPI.post('/api/v1/koi-fishes', {
          name: newFish.name,
          origin: newFish.origin,
          gender: newFish.gender,
          dob: newFish.dob,
          length: newFish.length,
          weight: newFish.weight,
          isAvailableForSale: newFish.isAvailableForSale,
          price: newFish.price,
          isSold: newFish.isSold,
          personalityTraits: newFish.personalityTraits,
          dailyFeedAmount: newFish.dailyFeedAmount,
          lastHealthCheck: newFish.lastHealthCheck,
          koiBreedIds: newFish.koiBreedIds,
          imageUrls: newFish.imageUrls,
          certificates: [
            {
              certificateUrl: 'string',
              certificateType: 'string'
            }
          ]
        })
        console.log('hehehehe', response.data)
        toast({
          variant: 'success',
          title: 'Fish Added',
          description: 'The fish has been added successfully!'
        })
        navigate('/fishes')
      }
    } catch (error) {
      console.error('Error saving fish:', error)
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || 'An unexpected error occurred'
        const statusCode = error.response?.status || 'No status code'
        toast({ variant: 'destructive', title: `Error ${statusCode}`, description: serverMessage })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an issue saving the fish. Please try again.'
        })
      }
    }
  }

  const handleDelete = async () => {
    try {
      await koiAPI.delete(`/api/v1/koi-fishes/${id}`)
      toast({
        variant: 'success',
        title: 'Fish Deleted',
        description: 'The fish has been delete successfully!'
      })
      setShowDeleteModal(false)
      setTimeout(() => navigate('/fishes'), 1000)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an issue deleting the fish. Please try again.'
      })
      console.error('Error deleting fish:', error)
    }
  }
  // Assuming `fishData.koiBreedIds` and `koiBreeds` array are available
  const selectedBreeds = fishData.koiBreedIds.map(
    (breedId) => koiBreeds.find((breed) => breed.id === breedId)?.name || ''
  )

  console.log('New FISH', newFish)
  console.log('New FISH', selectedBreeds)

  return (
    <>
      <div className='flex items-center hover:underline cursor-pointer' onClick={() => navigate('/fishes')}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back
      </div>
      {id ? (
        <form id='addFishForm' onSubmit={handleSubmit}>
          <h2 className='text-2xl font-semibold mb-4 text-center'>{id ? 'Update' : 'Add'} Fish</h2>

          <label htmlFor='name'>Name:</label>
          <input type='text' id='name' name='name' value={fishData.name} onChange={handleUpdateChange} />
          <br />
          <label htmlFor='origin'>Origin:</label>
          <input type='text' id='origin' name='origin' value={fishData.origin} onChange={handleUpdateChange} />
          <br />
          {/* <label htmlFor='gender'>Gender:</label>
          <input type='text' id='gender' name='gender' value={fishData.gender} onChange={handleInputChange} />
          <br /> */}
          <label>Gender:</label>
          <label>
            <input
              type='radio'
              name='gender'
              value='true'
              checked={fishData.gender === 'Male' || fishData.gender === true}
              onChange={handleUpdateChange}
            />
            Male
          </label>
          <label>
            <input
              type='radio'
              name='gender'
              value='false'
              checked={fishData.gender === 'Female' || fishData.gender === false}
              onChange={handleUpdateChange}
            />
            Female
          </label>
          {/* <input
            type='checkbox'
            id='gender'
            name='gender'
            title='Male'
            checked={fishData.gender}
            onChange={handleInputChange}
          /> */}
          {/* <select id='gender' name='gender' value={fishData.gender ? 'true' : 'false'} onChange={handleInputChange}>
            <option value='true'>Male</option>
            <option value='false'>Female</option>
          </select> */}
          <br />

          <label htmlFor='dob'>Date of Birth:</label>
          <input
            type='date'
            id='dob'
            name='dob'
            value={fishData.dob.toISOString().substring(0, 10)}
            onChange={handleUpdateChange}
          />
          <br />
          <label htmlFor='length'>Length (cm):</label>
          <input type='number' id='length' name='length' value={fishData.length} onChange={handleUpdateChange} />
          <br />
          <label htmlFor='weight'>Weight (g):</label>
          <input type='number' id='weight' name='weight' value={fishData.weight} onChange={handleUpdateChange} />
          <br />
          <label htmlFor='personalityTraits'>Personality Traits:</label>
          <input
            type='text'
            id='personalityTraits'
            name='personalityTraits'
            value={fishData.personalityTraits}
            onChange={handleUpdateChange}
          />
          <br />
          <label htmlFor='dailyFeedAmount'>Daily Feed Amount (g):</label>
          <input
            type='number'
            id='dailyFeedAmount'
            name='dailyFeedAmount'
            value={fishData.dailyFeedAmount}
            onChange={handleUpdateChange}
          />
          <br />
          <label htmlFor='lastHealthCheck'>Last Health Check:</label>
          <input
            type='date'
            id='lastHealthCheck'
            name='lastHealthCheck'
            value={fishData.lastHealthCheck.toISOString().substring(0, 10)}
            onChange={handleUpdateChange}
          />
          <br />
          <label htmlFor='isAvailableForSale'>Available for Sale:</label>
          <input
            type='checkbox'
            id='isAvailableForSale'
            name='isAvailableForSale'
            checked={fishData.isAvailableForSale}
            onChange={handleUpdateChange}
          />
          <br />
          <label htmlFor='price'>Price:</label>
          <input type='number' id='price' name='price' value={fishData.price} onChange={handleUpdateChange} />
          <br />
          <label htmlFor='isSold'>Sold:</label>
          <input type='checkbox' id='isSold' name='isSold' checked={fishData.isSold} onChange={handleUpdateChange} />
          <br />
           {/* <label htmlFor='koiBreedIds'>Koi Breed:</label>
          <select
            name='koiBreedIds'
            value={fishData.koiBreedIds[0]} // Set selected options
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((option) => Number(option.value))
              setFishData({ ...fishData, koiBreedIds: selectedOptions })
            }}
            // multiple // Allows selecting multiple breeds
          >
            {koiBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
          <label htmlFor='koiBreedIds'>Koi Breed2:</label>
          <select
            name='koiBreedIds'
            value={fishData.koiBreedIds[1]} // Set selected options
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((option) => Number(option.value))
              setFishData({ ...fishData, koiBreedIds: selectedOptions })
            }}
            // multiple // Allows selecting multiple breeds
          >
            {koiBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select> */}
          {fishData.koiBreedIds.map((breed, index) => (
        <div key={index}>
          <label htmlFor={`koiBreedIds-${index}`}>Koi Breed {index + 1}:</label>
          <select
            id={`koiBreedIds-${index}`}
            value={breed.id || ''}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const newKoiBreedIds = [...fishData.koiBreedIds];
              newKoiBreedIds[index] = selectedId; // Update only the selected index
              setFishData({ ...fishData, koiBreedIds: newKoiBreedIds });
            }}
            disabled
          >
            <option value="" disabled>Select a breed</option>
            {koiBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>

          {/* {id && (
            <div>
              <h3>{koiBreeds.find(breed => breed.id === id).name}</h3>
              <img src={koiBreeds.find(breed => breed.id === id).imageUrl} alt={koiBreeds.find(breed => breed.id === id).name} />
              <p>{koiBreeds.find(breed => breed.id === id).content}</p>
            </div>
          )} */}
        </div>
      ))}
          {/* <label htmlFor='koiBreedIds'>Koi Breed:</label>
          <select
            name='koiBreedIds'
            value={fishData.koiBreedIds.map(String)}
            onChange={(e) => setNewFish({ ...newFish, koiBreedIds: [Number(e.target.value)] })}
          >
            {koiBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select> */}
          {/* <br /> */}
          {/* <label htmlFor='koiCertificates'>Koi Certificates:</label>
          <input
            type='text'
            id='koiCertificates'
            name='koiCertificates'
            placeholder='Enter koi certificate URLs'
            value={newKoiCertificate}
            onChange={(e) => setNewKoiCertificate(e.target.value)}
          /> */}
          {/* <button type='button' onClick={addKoiCertificate}>
        Add Certificate
      </button> */}
          {/* <br /> */}
          {/* <ul>
        {newFish.koiCertificates.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul> */}
          {/* <label htmlFor='imageUrls'>Image URLs:</label>
          <input
            type='text'
            id='imageUrls'
            name='imageUrls'
            placeholder='Enter image URL'
            value={fishData.imageUrls}
            onChange={(e) => setFishData({ ...fishData, imageUrls: [String(e.target.value)] })}
          /> */}
          {/* <button type='button' onClick={addImageUrl}>
        Add Image URL
      </button> */}
          {/* <br /> */}
          {/* <ul>
        {newFish.imageUrls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul> */}
          <button type='submit' className='w-full py-2 px-4'>
            {id ? 'Update' : 'Add'} Fish
          </button>
        </form>
      ) : (
        <form id='addFishForm' onSubmit={handleSubmit}>
          <h2 className='text-2xl font-semibold mb-4 text-center'>{id ? 'Update' : 'Add'} Fish</h2>

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
          <input
            type='date'
            id='dob'
            name='dob'
            value={newFish.dob.toISOString().substring(0, 10)}
            onChange={handleInputChange}
          />
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
          <label htmlFor='isSold'>Sold:</label>
          <input type='checkbox' id='isSold' name='isSold' checked={newFish.isSold} onChange={handleInputChange} />
          <br />
          {/* <label htmlFor='koiBreedIds'>Koi Breed:</label>
          <select
            name='koiBreedIds'
            value={newFish.koiBreedIds.map(String)}
            onChange={(e) => setNewFish({ ...newFish, koiBreedIds: [Number(e.target.value)] })}
          >
            <option>Select breed</option>
            {koiBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor='koiBreedIds'>Koi Breed 2:</label>
          <select
            name='koiBreedIds'
            value={newFish.koiBreedIds.map(String)} // Set selected options
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((option) => Number(option.value))
              setNewFish({ ...newFish, koiBreedIds: [selectedOptions] })
            }}
            // multiple // Allows selecting multiple breeds
          >
            {koiBreeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select> */}

<label htmlFor='koiBreedId1'>Koi Breed 1:</label>
      <select
        name='koiBreedId1'
        value={newFish.koiBreedIds[0] || ''}
        onChange={(e) => handleSelectChange(e, 0)}
      >
        <option value=''>Select breed</option>
        {koiBreeds.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor='koiBreedId2'>Koi Breed 2:</label>
      <select
        name='koiBreedId2'
        value={newFish.koiBreedIds[1] || ''}
        onChange={(e) => handleSelectChange(e, 1)}
      >
        <option value=''>Select breed</option>
        {koiBreeds.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>
          {/* <label htmlFor='koiCertificates'>Koi Certificates:</label>
          <input
            type='text'
            id='koiCertificates'
            name='koiCertificates'
            placeholder='Enter koi certificate URLs'
            // value={newKoiCertificate}
            // onChange={(e) => setNewKoiCertificate(e.target.value)}
            value={newFish.koiCertificates}
            // onChange={(e) => setNewImageUrl(e.target.value)}
            onChange={(e) => setNewFish({ ...newFish, koiCertificates: [String(e.target.value)] })}
          /> */}
          {/* <button type='button' onClick={addKoiCertificate}>
        Add Certificate
      </button> */}
          <br />
          {/* <ul>
        {newFish.koiCertificates.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul> */}
          <label htmlFor='imageUrls'>Image URLs:</label>
          <input
            type='text'
            id='imageUrls'
            name='imageUrls'
            placeholder='Enter image URL'
            value={newFish.imageUrls}
            // onChange={(e) => setNewImageUrl(e.target.value)}
            onChange={(e) => setNewFish({ ...newFish, imageUrls: [String(e.target.value)] })}
          />
          {/* <button type='button' onClick={addImageUrl}>
        Add Image URL
      </button> */}
          <br />
          {/* <ul>
        {newFish.imageUrls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul> */}
          <button type='submit' className='w-full py-2 px-4'>
            {id ? 'Update' : 'Add'} Fish
          </button>
        </form>
      )}
      <div className='max-w-md mx-auto'>
        {id && (
          <Button
            className='w-full py-2 px-4 mt-4 border-primary text-primary hover:text-primary'
            variant='outline'
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Fish
          </Button>
        )}
      </div>
      {showDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-md max-w-sm w-full'>
            <h3 className='text-lg font-semibold'>Confirm Deletion</h3>
            <p className='mt-2 text-gray-600'>Are you sure you want to delete this fish?</p>
            <div className='flex justify-end space-x-4 mt-4'>
              <Button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 bg-white text-primary hover:bg-white hover:underline'
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} className='px-4 py-2 bg-red-600 text-white'>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddFishForm
