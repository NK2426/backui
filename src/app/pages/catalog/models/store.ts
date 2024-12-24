export class Store {
  id?: number;
  name?: string;
  address?: string;
  address1?: string;
  address2?: string;
  map?: string;
  mobile?: number;
  pincode?: number;
  image?: string;
  status?: string;
  state_image?: string;
  state_id?: number;
  slug?: string;
}
export class StorePaginate {
  datas?: Store[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
