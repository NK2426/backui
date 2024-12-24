export class Events {
    id?: number;
    title?: string;
    content?: string;
    image?: string;
    type?: string;
    link?: string;
    status?: string;
    createdAt?: number;
    slug?:string
    link_name?:string;
    updatedAt?: number;
  }
  export class EventsPaginate {
    datas?: Events[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }
  