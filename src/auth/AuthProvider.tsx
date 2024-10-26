import axios from 'axios'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import koiAPI from '@/lib/koiAPI'
import { toast } from 'sonner'

interface AuthContextType {
  token: string | null
  user: User | null
  userDetail: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  errorMessage: string | null
  loading: boolean
}

// interface User {
//   UserID: string
//   UserName: string
//   Password: string
//   FullName: string
//   Email: string
//   Avatar: string
//   Address: string
//   OtpCode: string
//   PhoneNumber: string
//   Balance: number
//   CreateDate: string
//   IsVerified: boolean
//   Status: string
//   RoleName: string
//   RoleID: string
//   Result: any,
//   CompanyID:string
// }

// interface IUserDetail {
//   UserID: string
//   UserName: string
//   Password: string
//   FullName: string
//   Email: string
//   Avatar: string
//   Address: string
//   OtpCode: string
//   PhoneNumber: string
//   Balance: number
//   CreateDate: string
//   IsVerified: boolean
//   Status: string
//   RoleID: string
//   RoleName: string
//   CompanyID: string
// }
interface User {
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
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })
  const [user, setUser] = useState<User | null>(null)
  const [userDetail, setUserDetail] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await koiAPI.get<ApiResponse<User>>(`/api/v1/users/${token}`)
          const userData = response.data.data
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('token')
          console.error('Fetching user information failed:', error)
        }
      }
    }
    fetchUser()
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await koiAPI.post('/api/v1/users/login', {
        email: email,
        password: password
      })
      const newToken = response.data.data.userId
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)

      const fetchUser = async () => {
        try {
          const response = await koiAPI.get<ApiResponse<User>>(`/api/v1/users/${newToken}`)

          const userData = response.data.data
          setUser(userData)
          // console.log("User Data after login:", userData)
          // console.log("check",response.data.Result.RoleName)
          if (response.data.data.roleName === 'MANAGER' || response.data.data.roleName === 'ADMIN') {
            toast.success('Sign in successfully!')
            navigate(`/home/${response.data.data.roleName.toLowerCase()}`)
          } else {
            toast.error('The account is not allowed to log into the system!')
            localStorage.removeItem('token')
          }
        } catch (error) {
          toast.error('Login error. Please try again later!')
          console.error('Fetching user information failed:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchUser()
    } catch (error) {
      setLoading(false)
      toast.error('Email or password is incorrect')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    toast.success('Successfully signed out')
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ token, user, userDetail, login, logout, errorMessage, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
