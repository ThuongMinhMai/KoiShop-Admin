'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/global/atoms/ui/button';
import { Input } from '@/components/global/atoms/ui/input';
import { DataTableViewOptions } from '../table/view-options';
import { FishSymbol } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const navigate = useNavigate();
  return (
    <div className="ml-2 mb-2 flex justify-between">
      <div className="flex space-x-2">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-x-2'>
        <Button className='h-8' onClick={() => navigate('/breeds/add')}> <FishSymbol className='mr-2 w-4 h-4'/>Add new breed</Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
