/** @format */
'use client'

import { useState } from 'react'
import { Nav } from '../atoms/ui/nav'

interface SideNavbarProps {
  isManager: boolean
}

import { useWindowWidth } from '@react-hook/window-size'
import {
  Bus,
  ChevronRight,
  Handshake,
  LandPlot,
  LayoutDashboard,
  Route,
  Settings,
  SwatchBook,
  ReceiptText,
  Users,
  UsersRound,
  Biohazard,
  Fish,
  Nut
} from 'lucide-react'
import { Button } from '../atoms/ui/button'

export default function SideNavbar({ isManager }: SideNavbarProps) {
  // console.log('admin ơ nav', isAdmin)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onlyWidth = useWindowWidth()
  const mobileWidth = onlyWidth < 768

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }
  const managerLinks = [
    {
      title: 'Dashboard',
      href: '/home/manager',
      icon: LayoutDashboard,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Orders',
      href: '/orders',
      icon: ReceiptText,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Breeds',
      href: '/breeds',
      icon: Biohazard,
      variant: 'ghost' as 'default' | 'ghost'
    },
    
    {
      title: 'Fishes',
      href: '/fishes',
      icon: Fish,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Diets',
      href: '/diets',
      icon: Nut,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Users',
      href: '/users',
      icon: UsersRound,
      variant: 'ghost' as 'default' | 'ghost'
    },
    // {
    //   title: 'Đăng xuất',
    //   href: '/login',
    //   icon: LogOut,
    //   variant: 'ghost' as 'default' | 'ghost'
    // }
  ]

  const staffLinks = [
    {
      title: 'Dashboard',
      href: '/home/staff',
      icon: LayoutDashboard,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Orders',
      href: '/ordersCheck',
      icon: ReceiptText,
      variant: 'default' as 'default' | 'ghost'
    }
  ]
  return (
    <div className='relative min-w-[80px] min-h-screen h-fit transition-all duration-300 ease-in-out border-r px-3 pb-10 pt-24'>
      {!mobileWidth && (
        <div className='absolute right-[-20px] top-24 '>
          <Button
            onClick={toggleSidebar}
            variant='secondary'
            className=' rounded-full p-2 transition-transform duration-300'
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight className='text-[#6d1a1a]' />
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={isManager ? managerLinks : staffLinks}
        // links={adminLinks }
      />
    </div>
  )
}
