import { Categories, Subcategories } from './purchaseorder';
export class Shelfing {
  id?: number;
  rowvalue?: string;
  columnvalue?: string;
  category_id?: number;
  subcategory_id?: number;
  createdBy?: number;
  modifiedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: number;
  category?: Categories;
  subcategory?: Subcategories;
  maxcount?: number;
}

export class Shelfingpaginate {
  datas?: Shelfing[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
