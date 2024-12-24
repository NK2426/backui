import { Documents } from './documents';
export class Vendor {
  vcategory?: string;
  agentId?: number;
  id?: number;
  uid?: number;
  uuid?: string;
  name?: string;
  description?: string;
  createdBy?: string;
  modifiedBy?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  mobile?: string;
  role?: string;
  roleID?: string;
  website?: string;
  addnumber?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  state_name?:string;
  zipcode?: string;
  bphone?: string;
  saddress?: string;
  saddress2?: string;
  scity?: string;
  sstate?: string;
  szipcode?: string;
  sphone?: string;
  gstin?: string;
  taxtype?: number;
  tin?: string;
  sameasbill?: number;
  documents?: Documents[];
  state_id?: number;
  account_name?: string;
  account_no?: string;
  ifsc?: string;
  bankname?: string;
  paymentterm_id?:number;
}
export class Vendors {
  vcategory?: string;
  agentId?: number;
  id?: number;
  uid?: number;
  uuid?: string;
  name?: string;
  description?: string;
  createdBy?: string;
  modifiedBy?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  mobile?: string;
  role?: string;
  roleID?: string;
  website?: string;
  addnumber?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  state_name?:string;
  zipcode?: string;
  bphone?: string;
  saddress?: string;
  saddress2?: string;
  scity?: string;
  sstate?: string;
  szipcode?: string;
  sphone?: string;
  gstin?: string;
  taxtype?: number;
  tin?: string;
  sameasbill?: number;
  documents?: Documents[];
  agent?:VendorAgent[];
  category?:VCategory[];
  state_id?: number;
  account_name?: string;
  account_no?: string;
  ifsc?: string;
  bankname?: string;
  paymentterm_id?:number;
}
export class Vendorpaginate {
  datas?: Vendor[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
export class VCategory {
  vcid?: number;
  uuid?: string;
  name?: string;
  description?: string;
  status?: number;
}
export class VCategorypaginate {
  datas?: VCategory[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
export class VendorAgent {
  id?: number;
  uuid?: string;
  name?: string;
  email?: string;
  mobile?: number;
  status?: string;
}
export class VendorAgentpaginate {
  datas?: VendorAgent[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
export class Address {
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  state_id?: number;
  zipcode?: string;
  phone?: string;
  'superstate.id'?: number;
  'superstate.name'?: string;
}
export class Vendordetail {
  uuid?: string;
  agentId?:number;
  vcategory?:number;
  vendorId?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  mobile?: string;
  website?: string;
  gstin?: string;
  tin?: string;
  account_name?: string;
  account_no?: string;
  ifsc?: string;
  bankname?: string;
  state_name?:string;
}
export class Vendormapping {
  id?: number;
  product_id?: number;
  vendor_id?: number;
  user?: Vendor;
  status?: any;
  price?: number;
  mrp?: number;
  vendorproId?: string;
  reason?: string;
}

export class State {
  id?: number;
  name?: string;
}
