import { CatalogItem } from './catalog-item';
import { CustomRequest } from './custom-request';

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  item?: CatalogItem;
  custom?: CustomRequest;
}