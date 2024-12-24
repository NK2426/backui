export class Blog {
  id?: number;
  title?: string;
  content?: string;
  image?: string;
  status?: string;
  createdAt?: number;
  slug?:string
  updatedAt?: number;
}
export class BlogPaginate {
  datas?: Blog[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
}
