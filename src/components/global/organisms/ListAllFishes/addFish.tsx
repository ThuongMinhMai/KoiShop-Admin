import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../atoms/ui/use-toast'
import koiAPI from '@/lib/koiAPI'

interface Fish {
  id: number
  name: string
  origin: string
  gender: string
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
    imageUrls: [null]
  })
  const [koiBreeds, setKoiBreeds] = useState<KoiBreed[]>([])
  const [newKoiCertificate, setNewKoiCertificate] = useState<string>('')
  const [newImageUrl, setNewImageUrl] = useState<string>('')

  useEffect(() => {
    const fetchKoiBreeds = async () => {
      try {
        const response = await koiAPI.get('/api/v1/koi-breeds')
        setKoiBreeds(response.data)
        console.log('koi breeds:', response.data)
      } catch (error) {
        console.error('Error fetching koi breeds:', error)
      }
    }
    fetchKoiBreeds()
  }, []);

  var koiBreedsArray = Object.values(koiBreeds); // doi ve array
  var koiBreedsArr = koiBreedsArray[1];
  // console.log("CAIS TEN CUA CAI KIA LA CAI GI",koiBreedsArray);
  console.log("CAIS TEN CUA CAI KIA LA CAI GI",koiBreedsArray[1]);
  console.log("alooooooooooo",koiBreedsArr);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // Type guard for HTMLInputElement
    if (e.target instanceof HTMLInputElement) {
      const inputValue = type === 'checkbox' ? e.target.checked : value
      setNewFish((prevFish) => ({
        ...prevFish,
        [name]: inputValue
      }))
    } else if (e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value))
      setNewFish((prevFish) => ({
        ...prevFish,
        [name]: selectedOptions
      }))
    }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await koiAPI.post('/api/v1/koi-fishes', 
        {
          name: "string",
          origin: "string",
          gender: "string",
          dob: "2024-10-30T11:15:09.640Z",
          length: 0,
          weight: 0,
          isAvailableForSale: true,
          price: 0,
          isSold: true,
          personalityTraits: "string",
          dailyFeedAmount: 0,
          lastHealthCheck: "2024-10-30T11:15:09.640Z",
          koiBreedIds: [
            1
          ],
          imageUrls: [
            "string"
          ],
          certificates: [
            {
              certificateUrl: "string",
              certificateType: "string"
            }
          ]
        
      })
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
      <label htmlFor='koiBreedIds'>Koi Breed:</label>
      <select
        name='koiBreedIds'
        value={newFish.koiBreedIds.map(String)}
        onChange={(e) => setNewFish({ ...newFish, koiBreedIds: [Number(e.target.value)] })}
      >
        {koiBreedsArray.map((breed) => (
          <option key={breed.id} value={breed.id}>
            {breed.name}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor='koiCertificates'>Koi Certificates:</label>
      <input
        type='text'
        id='koiCertificates'
        name='koiCertificates'
        value={newKoiCertificate}
        onChange={(e) => setNewKoiCertificate(e.target.value)}
      />
      <button type='button' onClick={addKoiCertificate}>
        Add Certificate
      </button>
      <br />
      <ul>
        {newFish.koiCertificates.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul>
      <label htmlFor='imageUrls'>Image URLs:</label>
      <input
        type='text'
        id='imageUrls'
        name='imageUrls'
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
      />
      <button type='button' onClick={addImageUrl}>
        Add Image URL
      </button>
      <br />
      <ul>
        {newFish.imageUrls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul>
      <button type='submit'>Add Fish</button>
    </form>
  )
}

export default AddFishForm
