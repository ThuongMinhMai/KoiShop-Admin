'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/global/atoms/ui/button';
import { Input } from '@/components/global/atoms/ui/input';
import { DataTableFacetedFilter } from '../table/faceted-filter';
import { DataTableViewOptions } from '../table/view-options';

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Get unique values for filtering by 'orderStatus' and 'paymentMethod'
  const uniqueOrderStatus = Array.from(table.getColumn('orderStatus')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  );

  const uniquePaymentMethods = Array.from(table.getColumn('paymentMethod')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  );

  const resetTrigger = table.getState().columnFilters.length;

  return (
    <div className="ml-2 mb-2 flex justify-between">
      <div className="flex space-x-2">
        <Input
          placeholder="Search by shipping address..."
          value={(table.getColumn('shippingAddress')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('shippingAddress')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <DataTableFacetedFilter column={table.getColumn('orderStatus')} title="Order Status" options={uniqueOrderStatus} />

        <DataTableFacetedFilter column={table.getColumn('paymentMethod')} title="Payment Method" options={uniquePaymentMethods} />

        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
