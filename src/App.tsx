import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ManagerProtectedRoute from './auth/ManagerProtectedRoute'
import ProtectedRoute from './auth/ProtectedRoute'
import Loader from './components/global/molecules/Loader'
import Loading from './components/global/molecules/Loading'
import SignInForm from './components/global/organisms/SignInForm'
import NotAuthorized from './components/global/templates/NotAuthorized'
import NotFoundPage from './components/global/templates/NotFoundPage'
import ProfilePage from './components/global/templates/ProfilePage'
import StaffProtectedRoute from './auth/StaffProtectedRoute'
import AllFishes from './components/global/templates/AllFishes'
import AddFishForm from './components/global/organisms/ListAllFishes/addFish'
import AllOrder from './components/global/templates/AllOrder'
import AllBreeds from './components/global/templates/AllBreeds'
import BreedForm from './components/global/templates/BreedForm'
const RouteLayout = React.lazy(() => import('./components/global/Layout/RouteLayout'))
const AllAccount= React.lazy(() => import('./components/global/templates/AllAccount'))

function App() {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return loading ? (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Loading />
    </div>
  ) : (
    <Routes>
      <Route element={<RouteLayout />}>
        <Route
          path='/home/manager'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/home/staff'
          element={
            <StaffProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </StaffProtectedRoute>
          }
        />

        <Route
          path='/users'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><AllAccount /></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><AllOrder/></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/breeds'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><AllBreeds /></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/breeds/add'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><BreedForm /></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/breeds/:id'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><BreedForm /></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/fishes'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><AllFishes/></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/fishes/addFish'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}><AddFishForm/></Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/diets'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/ordersCheck'
          element={
            <StaffProtectedRoute>
              <Suspense fallback={<Loader />}><AllOrder/></Suspense>
            </StaffProtectedRoute>
          }
        />

        <Route path='/profile' element={<ProfilePage />} />
      </Route>

      <Route
        path='/'
        element={
          <ProtectedRoute>
            <SignInForm />
          </ProtectedRoute>
        }
      />

      <Route path='/not-authorized' element={<NotAuthorized />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
