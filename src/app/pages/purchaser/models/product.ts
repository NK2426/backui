import { Productvariants } from './productvariants';
import { Brands, Department, Categories, Subcategories, User, Tax } from './purchaseorder';

export class Product {
  pid?: number;
  uuid?: string;
  name?: string;
  sku?: string;
  department_id?: string;
  category_id?: string;
  subcategory_id?: string;
  group_id?: string;
  brand_id?: string;
  unit?: string;
  createdBy?: string;
  modifiedBy?: string;
  status?: string;
  reqstatus?: number;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  department?: Department;
  category?: Categories;
  subcategory?: Subcategories;
  brand?: Brands;
  dimensions?: string;
  width?: string;
  height?: string;
  weight?: string;
  cost_price?: string;
  selling_price?: string;
  vendormappings?: Vendormapping[];
  vendorvariantmappings?: Vendorvariantmapping[];
  variants?: any;
  taxpercentage?: number;
  tax?: Tax;
  productsmaps?: Productmap[];
  productmapparams?: Productmapparam[];
  productselectimages?: Productselectimage[];
  user?: User;
  productId?: string;
  // ctax_id?: any;
  // stax_id?: any;
  tax_id?: any;
  // ctax?: Tax;
  // stax?: Tax;
  percentage?: number;
  hsncode?: string;
  ifigst?: number;
  vendormapping?: Vendormapping;
  productvariants?: Productvariants[];
  image?: Productimage;
  group?: Group;
}

export class Vendorvariantmapping {
  id?: number;
  uuid?: string;
  department_id?: number;
  brand_id?: number;
  category_id?: number;
  subcategory_id?: number;
  group_id?: number;
  product_id?: number;
  vendor_id?: number;
  productID?: string;
  vendorproId?: string;
  mrp?: number;
  price?: number;
  sku?: string;
  skuid?: string;
  name?: number;
  description?: string;
  width?: string;
  height?: string;
  weight?: string;
  length?: string;
  percentage?: number;
  hsncode?: string;
  modifiedBy?: number;
  status?: number;
}

export class Group {
  gid?: number;
  uuid?: string;
  name?: string;
  createdBy?: string;
}

export class Vendormapping {
  id?: number;
  product_id?: number;
  vendor_id?: number;
  //user?: Vendor;
  status?: any;
  price?: number;
  vendorproId?: string;
}

export class Productpaginate {
  datas?: Product[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
export class Productmap {
  product_id?: string;
  productvariant_id?: string;
  productvariant?: Productvariants;
}
export class Productmapparam {
  id?: string;
  value_id?: any;
  productparameter?: Productparmeter;
  productparametervalue?: Productparmetervalue;
}
export class Productparmeter {
  id?: string;
  name?: string;
}
export class Productparmetervalue {
  id?: string;
  value?: string;
}
export class Productselectimage {
  id?: number;
  product_id?: number;
  image_id?: number;
  path?: string;
  select?: boolean;
}

export class Productimage {
  id?: number;
  product_id?: number;
  path?: string;
  select?: boolean;
}
