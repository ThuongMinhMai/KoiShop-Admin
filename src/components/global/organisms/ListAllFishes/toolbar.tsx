'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'
import { useNavigate } from 'react-router-dom'

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

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const navigate = useNavigate()
  const isFiltered = table.getState().columnFilters.length > 0
  // const uniqueBreed = Array.from(table.getColumn('koiBreeds')?.getFacetedUniqueValues()?.entries() || []).map(
  //   ([key]) => key
 
  // )
  const uniqueStatus = Array.from(table.getColumn('isAvailableForSale')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => {
      return {
        value: key,
        label: key ? 'Available' : 'Not Available'
      }
    }
  )
  const resetTrigger = table.getState().columnFilters.length

  return (
    <div className='ml-2 mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Search the fish...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {/* <DataTableFacetedFilter column={table.getColumn('koiBreeds')} title='Breed' options={uniqueBreed} /> */}
        <DataTableFacetedFilter column={table.getColumn('isAvailableForSale')} title='Status' options={uniqueStatus} />
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 size-4' />
          </Button>
        )}
      </div>
      <div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
