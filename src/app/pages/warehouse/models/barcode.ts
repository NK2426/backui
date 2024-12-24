import { Warehouse } from "./purchaseorder";


export class BarCode {
  id?: number;
  vendor_id?: number;
  qty?: number;
  barcode?: string;
  name?: string;
  v_name?: string;
  image?: string;
  shelf_id: string;
  color?:string;
  status?:number;
}
export class BarCodepaginate {
  datas?: BarCode[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}



export class Audit {
  id?: number;
  warehouse?: Warehouse;
  qty?: number;
  price?: number;
  mrp?: number;
  psid?: string;
  createdAt?: string;
  updatedAt?: string;
  
}
export class Auditpaginate {
  datas?: BarCode[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  warehouse: any;
}
