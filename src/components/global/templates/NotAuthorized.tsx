import { Undo2 } from 'lucide-react'
import { Button } from '../atoms/ui/button'
import { Link } from 'react-router-dom'

const NotAuthorized = () => {
  return (
    <div className='flex justify-center items-center min-h-screen flex-col gap-2'>
      <h1 className='text-2xl'>You are not authorized to access this page</h1>
      <Link to='/'>
        <Button>
          <Undo2 />
          Return home
        </Button>
      </Link>
    </div>
  )
}

export default NotAuthorized
