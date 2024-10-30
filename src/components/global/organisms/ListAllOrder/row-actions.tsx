import { Row } from '@tanstack/react-table';
import { Badge } from '../../atoms/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select';

interface DataTableRowActionsProps<TData extends Order> {
  row: Row<TData>;
  handleStatusChange: (order: Order, status: string) => void;
}

interface Order {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: string;
  shippingAddress: string;
  paymentMethod: string;
  note: string;
  walletTransaction: string;
  orderDetails: object[];
}

export function DataTableRowActions<TData extends Order>({
  row,
  handleStatusChange
}: DataTableRowActionsProps<TData>) {
  const statusString = row.original.orderStatus;
console.log("trang thai order", statusString)
  return (
    <div>
      <Select
        value={statusString}
        onValueChange={(value) => handleStatusChange(row.original, value)}
      >
        <SelectTrigger className="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-fit">
          <SelectItem value="PENDING">
            <Badge variant="warning">Pending</Badge>
          </SelectItem>
          <SelectItem value="SHIPPED">
            <Badge variant="info">Shipped</Badge>
          </SelectItem>
          <SelectItem value="DELIVERED">
            <Badge variant="default">Delivered</Badge>
          </SelectItem>
          <SelectItem value="CANCELLED">
            <Badge variant="destructive">Cancelled</Badge>
          </SelectItem>
          <SelectItem value="COMPLETED">
            <Badge variant="success">Complete</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
