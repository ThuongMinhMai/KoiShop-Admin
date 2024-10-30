import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import koiAPI from '@/lib/koiAPI'
import { Button } from '../atoms/ui/button'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

const BreedForm = () => {
  const { id } = useParams() // Get the id from the route
  const [breedData, setBreedData] = useState({
    name: '',
    content: '',
    imageUrl: ''
  })
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Fetch breed data if editing an existing one
  useEffect(() => {
    if (id) {
      const fetchBreed = async () => {
        try {
          const response = await koiAPI.get(`/api/v1/koi-breeds/${id}`)
          setBreedData({
            name: response.data.data.name || '',
            content: response.data.data.content || '',
            imageUrl: response.data.data.imageUrl || ''
          })
        } catch (error) {
          console.error('Error fetching breed data:', error)
        }
      }

      fetchBreed()
    }
  }, [id])

  // Handle form field changes
  const handleChange = (e: any) => {
    setBreedData({
      ...breedData,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      if (id) {
        await koiAPI.put(`/api/v1/koi-breeds/${id}`, breedData)
        toast.success('Breed updated successfully!')
        setTimeout(() => navigate('/breeds'), 1000)
      } else {
        await koiAPI.post('/api/v1/koi-breeds', breedData)
        toast.success('Breed added successfully!')
        setBreedData({ name: '', content: '', imageUrl: '' })
        setTimeout(() => navigate('/breeds'), 1000)
      }
    } catch (error) {
      toast.error('Error saving breed')
      console.error('Error saving breed data:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await koiAPI.delete(`/api/v1/koi-breeds/${id}`)
      toast.success('Breed deleted successfully!')
      setShowDeleteModal(false)
      setTimeout(() => navigate('/breeds'), 1000)
    } catch (error) {
      toast.error('Error deleting breed')
      console.error('Error deleting breed:', error)
    }
  }

  return (
    <>
      <div className='flex items-center hover:underline cursor-pointer' onClick={() => navigate('/breeds')}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back
      </div>
      <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-lg'>
        <h2 className='text-2xl font-semibold mb-4'>{id ? 'Edit' : 'Add'} Koi Breed</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='name' className='block font-medium text-gray-700'>
              Breed Name
            </label>
            <input
              type='text'
              name='name'
              value={breedData.name}
              onChange={handleChange}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <label htmlFor='content' className='block font-medium text-gray-700'>
              Content
            </label>
            <textarea
              name='content'
              value={breedData.content}
              onChange={handleChange}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
              rows={10}
              required
            />
          </div>
          <div>
            <label htmlFor='imageUrl' className='block font-medium text-gray-700'>
              Image URL
            </label>
            <input
              type='text'
              name='imageUrl'
              value={breedData.imageUrl}
              onChange={handleChange}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
            />
          </div>
          <Button type='submit' className='w-full py-2 px-4'>
            {id ? 'Update' : 'Add'} Breed
          </Button>
        </form>
        {id && (
          <Button
            className='w-full py-2 px-4 mt-4 border-primary text-primary hover:text-primary'
            variant='outline'
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Breed
          </Button>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2 text-gray-600">Are you sure you want to delete this breed?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <Button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-white text-primary hover:bg-white hover:underline">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BreedForm
