import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import ManagerProtectedRoute from './auth/ManagerProtectedRoute'
import ProtectedRoute from './auth/ProtectedRoute'
import Loader from './components/global/molecules/Loader'
import Loading from './components/global/molecules/Loading'
import SignInForm from './components/global/organisms/SignInForm'
import NotAuthorized from './components/global/templates/NotAuthorized'
import NotFoundPage from './components/global/templates/NotFoundPage'
import ProfilePage from './components/global/templates/ProfilePage'
const RouteLayout = React.lazy(() => import('./components/global/Layout/RouteLayout'))
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
          path='/home/admin'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/home/manager'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </ManagerProtectedRoute>
          }
        />

        <Route
          path='/users'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/companies'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/staffs'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/trips'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/routes'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>{/* components */}</Suspense>
            </ManagerProtectedRoute>
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
