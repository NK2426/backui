import { Brands } from './brands';
import { Categories } from './categories';
import { Department } from './department';
import { Group } from './groups';
import { Productvariants, Productvariantsvalues } from './productvariants';
import { Subcategories } from './subcategories';
import { User } from './user';
import { Vendormapping } from './vendor';
import { VENDOR_VARIANT } from './vendorvariant';

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
  width?: string;
  height?: string;
  length?: string;
  measure?: string;
  weight?: string;
  cost_price?: string;
  selling_price?: string;
  variants?: any;
  productsmaps?: Productmap[];
  vendormappings?: Vendormapping[];
  productmapparams?: Productmapparam[];
  vendor_id?: number;
  vendormapping?: Vendormapping;
  vendormap?: Vendormapping;
  vendorvariantmapping?: VENDOR_VARIANT.vendorVariant;
  group?: Group;
  // ctax_id?: any;
  // stax_id?: any;
  tax_id?: any;
  percentage?: number;
  productId?: string;
  user?: User;
  show_type?: string;
  store_id?: number;
  // ctax?: Tax;
  // stax?: Tax;
  tax?: Tax;
  hsncode?: string;
  //ifigst?:number;
  productselectimages?: Productimage[];
  reason?: string;
  sizechart?: string;
  country?: string;
  qty?: number;
}
export class Productpaginate {
  datas?: Product[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
export class Productmap {
  id?: number;
  product_id?: string;
  vendor_id?: number;
  productvariant_id?: string;
  productvariant?: Productvariants;
  variantvalues?: string;
  productvariantvalue?: Productvariantsvalues;
  order?: number;
}
export class Productimage {
  id?: number;
  product_id?: number;
  path?: string;
  select?: boolean;
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

export class Tax {
  id?: number;
  name?: string;
  percentage?: any;
  status?: string;
}

export class Taxpaginate {
  datas?: Tax[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
