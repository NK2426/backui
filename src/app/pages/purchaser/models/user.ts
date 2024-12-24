export class User {
  id?: number;
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
  role?: Role;
  roleID?: string;
  warehouse?: Warehouse;
  warehouse_id?: string;
  address?: string;
  dateofbirth?: string;
  dateofjoin?: string;
  salary?: string;
}
export class Userpaginate {
  datas?: User[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}

export class Role {
  id?: number;
  name?: string;
}

export class Warehouse {
  id?: number;
  name?: string;
  billingaddress?: string;
  createdBy?: string;
  address?: string;
  address1?: string;
  address2?: string;
  pincode?: string;
  mobile?: string;
}