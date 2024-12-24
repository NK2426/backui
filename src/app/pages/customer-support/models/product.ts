import { USER } from './user';
export interface Product {
  pid?: number;
  productId?: string;
  uuid?: string;
  name?: string;
  sku?: string;
  department_id?: string;
  category_id?: string;
  subcategory_id?: string;
  brand_id?: string;
  tax_id?: number;
  tax?: Tax;
  unit?: string;
  createdBy?: string;
  modifiedBy?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  department?: Department;
  category?: Categories;
  subcategory?: Subcategories;
  brand?: Brands;
  dimensions?: string;
  weight?: string;
  height?: string;
  cost_price?: string;
  hsncode?: string;
  selling_price?: string;
  variants?: any;
  //productsmaps?: Productmap[];
  vendormappings?: Vendormapping[];
  //productmapparams?: Productmapparam[];
  productselectimages?: Productselectimage[];
  productimages?: Productimage[];
  user?: USER.UserDetail;
  group?: Group;
  percentage?: number;
}
export class Department {
  did?: number;
  uuid?: string;
  name?: string;
  contact?: string;
  email?: string;
  description?: string;
  beauty?: number;
  createdBy?: string;
  modifiedBy?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  imgpath?: string;
}
export class Tax {
  id?: number;
  name?: string;
  percentage?: any;
}
export class Brands {
  bid?: number;
  uuid?: string;
  name?: string;
  createdBy?: string;
}
export class Categories {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
}
export class Subcategories {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
}

export class Productpaginate {
  datas?: Product[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}


export class Vendormapping {
  id?: number;
  product_id?: number;
  vendor_id?: number;
  price?: number;
  mrp?: number;
  status?: number;
  vendorproId?: string;
  user?: USER.UserDetail;
}


export class Productimage {
  id?: number;
  product_id?: number;
  path?: string;
  select?: boolean;
}

export interface Group {
  id: number;
  department_id: number;
  category_id: number;
  subcategory_id: number;
  name: string;
  description: string;
  status: number;
  tags: string;
  createdAt?: any;
  updatedAt?: any;
}


export interface Productselectimage {
  id: number;
  product_id: number;
  image_id: number;
  path: string;
}

export interface Row {
  id: number;
  sku: string;
  skuid: string;
  uuid: string;
  department_id: number;
  category_id: number;
  subcategory_id: number;
  group_id: number;
  brand_id: number;
  product_id: number;
  name: string;
  description: string;
  receivedqty: number;
  stockqty: number;
  quantity: number;
  shippedqty: number;
  returnqty: number;
  damageqty: number;
  status: number;
  department: Department;
  group: Group;
  product: Product;
}

export interface InventoryPaginated extends ReportHttpResponse {
  count?: number;
  datas: Row[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface Parameter {
  id: number;
  uuid: string;
  name: string;
  department_id: number;
  type: number;
  description: string;
  status: number;
  createdBy: number;
  modifiedBy: number;
  createdAt?: any;
  updatedAt?: any;
  group_id: number;
}

export interface Variant {
  id: number;
  uuid: string;
  name: string;
  displayname: string;
  department_id: number;
  type: number;
  showtype: string;
  refimg: string;
  reflabel: string;
  description: string;
  status: number;
  createdBy: number;
  modifiedBy: number;
  createdAt: Date;
  updatedAt: Date;
  group_id: number;
}

export interface ReportData {
  inventory: InventoryPaginated;
  parameters: Parameter[];
  variants: Variant[];
}

export interface ReportHttpResponse {
  status: number;
  message: string;
  data?: ReportData;
  datas?: any;
}
