import { CartItem } from './cart-item';

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'in_production' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  invoiceUrl?: string;
}